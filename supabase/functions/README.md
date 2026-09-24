# Supabase Edge Functions — WhatSend Pro

## whatsapp-send
Authenticated endpoint used by the application to send WhatsApp messages.

Required secrets:
- META_ACCESS_TOKEN
- META_GRAPH_API_VERSION (optional; defaults to a configured version)
- Supabase runtime variables are provided by Supabase.

## whatsapp-webhook
Webhook endpoint for Meta verification and incoming events.

Required secret:
- META_VERIFY_TOKEN

Deploy these functions from the Supabase project before enabling production WhatsApp messaging. Do not put Meta access tokens in frontend code.