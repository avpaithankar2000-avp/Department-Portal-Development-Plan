from sanjivani_copilot import PIIFilter


def test_pii_filter_redacts_common_sensitive_values():
    pii = PIIFilter()
    text = "Email me at user@example.com or call 415-555-1212. My SSN is 123-45-6789."

    result = pii.filter(text)

    assert "user@example.com" not in result
    assert "415-555-1212" not in result
    assert "123-45-6789" not in result
    assert "[EMAIL_REDACTED]" in result
    assert "[PHONE_REDACTED]" in result
    assert "[SSN_REDACTED]" in result
