import json
from math import ceil
from typing import Any


DATASET_SIZE = 100
DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100


def build_datatype_demo_records() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    tag_sets = [
        ["demo", "catalog", "typing"],
        ["mock", "store", "payload"],
        ["sample", "json", "testing"],
        ["frontend", "api", "learning"],
    ]
    product_names = [
        "Wireless Keyboard",
        "USB-C Hub",
        "Bluetooth Speaker",
        "Ergonomic Mouse",
        "27-inch Monitor",
        "Mechanical Keyboard",
        "Laptop Stand",
        "Noise-Canceling Headphones",
    ]
    note_templates = [
        None,
        "Includes nullable notes for parser testing.",
        "Useful for typed client demos.",
        "Contains mixed JSON datatypes.",
    ]

    for index in range(DATASET_SIZE):
        record_id = 501 + index
        store_number = index + 1
        records.append(
            {
                "id": record_id,
                "store": f"EasyJSON Demo Shop {store_number}",
                "version": (index % 5) + 1,
                "isActive": index % 3 != 0,
                "notes": note_templates[index % len(note_templates)],
                "tags": tag_sets[index % len(tag_sets)],
                "featuredProduct": {
                    "id": record_id,
                    "name": f"{product_names[index % len(product_names)]} {store_number}",
                },
            }
        )

    return records


RECORDS = build_datatype_demo_records()
RECORD_LOOKUP = {str(record["id"]): record for record in RECORDS}


def response(status_code: int, body: Any) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
        },
        "body": json.dumps(body),
    }


def parse_positive_int(value: str | None) -> int | None:
    if value is None or value == "":
        return None

    try:
        parsed = int(value)
    except ValueError:
        return None

    return parsed if parsed > 0 else None


def parse_non_negative_int(value: str | None) -> int | None:
    if value is None or value == "":
        return None

    try:
        parsed = int(value)
    except ValueError:
        return None

    return parsed if parsed >= 0 else None


def list_records(query: dict[str, str] | None) -> dict[str, Any]:
    params = query or {}

    has_page_inputs = params.get("page") is not None or params.get("pageSize") is not None
    page = parse_positive_int(params.get("page"))
    page_size = parse_positive_int(params.get("pageSize"))
    limit = parse_positive_int(params.get("limit"))
    offset = parse_non_negative_int(params.get("offset"))

    if has_page_inputs:
        if params.get("page") is not None and page is None:
            return response(400, {"message": "Invalid page. page must be a positive integer."})
        if params.get("pageSize") is not None and page_size is None:
            return response(
                400,
                {"message": "Invalid pageSize. pageSize must be a positive integer."},
            )

        current_page = page or DEFAULT_PAGE
        current_page_size = min(page_size or DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
        start = (current_page - 1) * current_page_size
        end = start + current_page_size
        items = RECORDS[start:end]
        total = len(RECORDS)
        total_pages = ceil(total / current_page_size) if total else 0

        return response(
            200,
            {
                "items": items,
                "pagination": {
                    "mode": "page",
                    "total": total,
                    "count": len(items),
                    "page": current_page,
                    "pageSize": current_page_size,
                    "totalPages": total_pages,
                    "hasNextPage": current_page < total_pages,
                    "hasPreviousPage": current_page > 1 and total_pages > 0,
                    "limit": current_page_size,
                    "offset": start,
                },
            },
        )

    if params.get("limit") is not None and limit is None:
        return response(400, {"message": "Invalid limit. limit must be a positive integer."})

    if params.get("offset") is not None and offset is None:
        return response(400, {"message": "Invalid offset. offset must be zero or a positive integer."})

    current_limit = min(limit or DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
    current_offset = offset or 0
    items = RECORDS[current_offset:current_offset + current_limit]
    total = len(RECORDS)
    derived_page = (current_offset // current_limit) + 1 if current_limit else 1
    total_pages = ceil(total / current_limit) if total else 0

    return response(
        200,
        {
            "items": items,
            "pagination": {
                "mode": "offset",
                "total": total,
                "count": len(items),
                "page": derived_page,
                "pageSize": current_limit,
                "totalPages": total_pages,
                "hasNextPage": current_offset + current_limit < total,
                "hasPreviousPage": current_offset > 0,
                "limit": current_limit,
                "offset": current_offset,
            },
        },
    )


def get_record_by_id(record_id: str) -> dict[str, Any]:
    record = RECORD_LOOKUP.get(record_id)
    if record is None:
        return response(404, {"message": "Record not found", "id": record_id})
    return response(200, record)


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    del context

    raw_path = event.get("rawPath") or event.get("requestContext", {}).get("http", {}).get("path", "")
    path_parameters = event.get("pathParameters") or {}
    query_parameters = event.get("queryStringParameters") or {}

    if raw_path.endswith("/api/json-datatypes-demo") or raw_path == "/api/json-datatypes-demo":
        return list_records(query_parameters)

    record_id = path_parameters.get("id")
    if record_id is not None:
        return get_record_by_id(record_id)

    normalized_path = raw_path.rstrip("/")
    if normalized_path.startswith("/api/json-datatypes-demo/"):
        fallback_id = normalized_path.split("/")[-1]
        if fallback_id:
            return get_record_by_id(fallback_id)

    return response(404, {"message": "Route not found", "path": raw_path})
