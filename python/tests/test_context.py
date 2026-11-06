import pytest
from vectora_extension import ExtensionContext, ExtensionManifest


class FakeTransport:
    def __init__(self) -> None:
        self.calls: list[tuple[str, dict[str, object]]] = []

    def request(self, method: str, params: dict[str, object]) -> object:
        self.calls.append((method, params))
        return {"ok": True}


MANIFEST = ExtensionManifest(
    id="demo", publisher="Vectora", version="0.1.0", api_version=1
)


def test_request_sends_method_and_params() -> None:
    transport = FakeTransport()
    context = ExtensionContext(MANIFEST, transport)
    assert context.request("workspace.read", {"path": "a"}) == {"ok": True}
    assert transport.calls == [("workspace.read", {"path": "a"})]


def test_request_without_params_sends_an_empty_dict() -> None:
    transport = FakeTransport()
    ExtensionContext(MANIFEST, transport).request("ping")
    assert transport.calls == [("ping", {})]


def test_manifest_defaults_protocol_version_and_is_immutable() -> None:
    assert MANIFEST.protocol_version == 1
    with pytest.raises(AttributeError):
        MANIFEST.id = "other"  # type: ignore[misc]
