"""Static component paths for root and prefixed Streamlit deployments."""
import streamlit as st


def static_asset_url(path: str) -> str:
    prefix = st.get_option("server.baseUrlPath").strip("/")
    return ("/" + prefix if prefix else "") + "/app/static/" + path.lstrip("/")
