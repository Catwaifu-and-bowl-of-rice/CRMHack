"""
see https://github.com/falconry/falcon/issues/1175
"""
import datetime as dt
import json

from falcon import errors, media


RFC3339_STRING = '%Y-%m-%dT%H:%M:%S.%fZ'
RFC3339_NO_FRACTION = '%Y-%m-%dT%H:%M:%SZ'
RFC3339_NO_ZULU = '%Y-%m-%dT%H:%M:%S.%f'
RFC3339_NO_FRACTION_NO_ZULU = '%Y-%m-%dT%H:%M:%S'
RFC3339_STRING_DATE_ONLY = '%Y-%m-%d'
VALID_TIMESTAMP_KEYS = ('datetime', 'date', 'timestamp')

VALID_DATETIME_STRINGS = [
    RFC3339_STRING, RFC3339_NO_FRACTION, RFC3339_NO_ZULU, RFC3339_NO_FRACTION_NO_ZULU
]


class JSONDateEncoder(json.JSONEncoder):
    """
    A subclass of JSONEncoder that can convert datetime and date objects to an
    RFC3339-compliant string format. The resulting format is always:
       `YYYY-MM-DDTHH:MM:SS.SSSSSSZ`
    """

    def default(self, obj):
        if isinstance(obj, dt.datetime):
            return obj.strftime(RFC3339_STRING)
        elif isinstance(obj, dt.date):
            return obj.isoformat()
        else:
            return super().default(obj)


class JSONDateHandler(media.BaseHandler):
    """
    A falcon media handler that can encode and—if keyed with "date", "datetime",
    or "timestamp"—decode between RFC3339 datetime strings and Python datetime
    objects.

    - The format string used for datetimes is '%Y-%m-%dT%H:%M:%S.%fZ'
    - The format string for dates is '%Y-%m-%d'
    - The encoder always outputs the full RFC3339 datetime string.
    - The decoder always assumes UTC, and expects a string in one of the above
      formats, or an integer or float POSIX timestamp.
    """

    def timestamp_to_datetime(self, timestamp):
        if timestamp is None:
            return None

        if isinstance(timestamp, (int, float)):
            return dt.datetime.utcfromtimestamp(timestamp)

        msg = (
            'Could not convert timestamp into datetime.datetime; '
            f'{timestamp} not valid int or float.'
        )
        raise ValueError(msg)

    def rfc3339_to_datetime(self, datetime_string):
        if datetime_string is None:
            return None

        for format_string in VALID_DATETIME_STRINGS:
            try:
                return dt.datetime.strptime(datetime_string, format_string)
            except ValueError:
                pass

        # Couldn't successfully convert datetime
        msg = (
                f'Could not convert {datetime_string} into datetime.datetime; '
                'must be on of the following formats:\n'
                'YYYY-MM-DDTHH:MM:SS.SSSSSSZ (RFC3339, preferred)\n'
                'YYYY-MM-DDTHH:MM:SSZ\n'
                'YYYY-MM-DDTHH:MM:SS.SSSSSS (UTC assumed)\n'
                'YYYY-MM-DDTHH:MM:SS (UTC assumed)'
            )
        raise ValueError(msg)

    def isodate_to_date(self, date_string):
        if date_string is None:
            return None

        try:
            return dt.datetime.strptime(date_string, RFC3339_STRING_DATE_ONLY).date()
        except ValueError:
            msg = (
                f'Could not convert {date_string} into datetime.date; '
                'must be ISO8601 format: YYYY-MM-DD'
            )
            raise ValueError(msg)

    def deserialize(self, raw, content_type, content_length):
        try:
            result = json.loads(raw.decode('utf-8'))
            for key in result:
                if 'datetime' in key:
                    result[key] = self.rfc3339_to_datetime(result[key])
                elif 'date' in key:
                    result[key] = self.isodate_to_date(result[key])
                elif 'timestamp' in key:
                    result[key] = self.timestamp_to_datetime(result[key])
            return result
        except ValueError as err:
            raise errors.HTTPBadRequest(
                'Invalid JSON',
                'Could not parse JSON body - {0}'.format(err)
            )

    def serialize(self, media, content_type):
        result = json.dumps(media, ensure_ascii=False, separators=(',', ':'), cls=JSONDateEncoder)
        return result.encode('utf-8')