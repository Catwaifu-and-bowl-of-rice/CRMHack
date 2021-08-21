FROM python:3.9.5-buster as base
WORKDIR /usr/src
RUN apt -yq update
RUN apt -yq upgrade

FROM base as builder
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN python -m venv /venv
RUN poetry export -f requirements.txt | /venv/bin/pip install -r /dev/stdin

FROM base as final
COPY --from=builder /venv /venv
RUN apt -yq update
COPY src src
COPY entrypoint.sh entrypoint.sh
CMD ["/bin/sh", "entrypoint.sh"]
