import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
Deno.serve(async(req)=>{
 try{
  if(req.method==="GET"){const u=new URL(req.url);const mode=u.searchParams.get("hub.mode");const token=u.searchParams.get("hub.verify_token");const challenge=u.searchParams.get("hub.challenge");if(mode==="subscribe"&&token&&token===Deno.env.get("META_VERIFY_TOKEN"))return new Response(challenge||"",{status:200});return new Response("Forbidden",{status:403})}
  if(req.method!=="POST")return new Response("Method Not Allowed",{status:405});
  const body=await req.json();const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||Deno.env.get("SUPABASE_SECRET_KEY");const supabaseUrl=Deno.env.get("SUPABASE_URL");
  if(!serviceKey||!supabaseUrl){console.error("Missing server Supabase key");return json({received:true,persisted:false})}
  const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  for(const entry of body?.entry||[])for(const change of entry?.changes||[]){const value=change?.value||{};const phoneNumberId=value?.metadata?.phone_number_id;if(!phoneNumberId)continue;const accountRes=await admin.from("whatsapp_accounts").select("id,user_id").eq("phone_number_id",phoneNumberId).maybeSingle();const account=accountRes.data;if(!account)continue;
   for(const status of value?.statuses||[])if(status?.id)await admin.from("messages").update({status:status.status||"updated"}).eq("meta_message_id",status.id).eq("whatsapp_account_id",account.id);
   for(const message of value?.messages||[]){const from=message?.from;if(!from)continue;let contact=(await admin.from("contacts").select("id").eq("user_id",account.user_id).eq("phone_number",from).maybeSingle()).data;if(!contact){const created=await admin.from("contacts").insert({user_id:account.user_id,name:value?.contacts?.[0]?.profile?.name||from,phone_number:from,tags:[]}).select("id").single();contact=created.data}const type=message?.type||"text";const bodyText=type==="text"?message?.text?.body:(type==="button"?message?.button?.text:null);await admin.from("messages").insert({user_id:account.user_id,whatsapp_account_id:account.id,contact_id:contact?.id||null,direction:"inbound",status:"received",message_type:type,body:bodyText||null,meta_message_id:message?.id||null});await admin.from("usage_events").insert({user_id:account.user_id,event_type:"message_received",quantity:1,amount:0,currency:"XOF",metadata:{meta_message_id:message?.id||null,type}})}
  }
  return json({received:true,persisted:true});
 }catch(e){console.error(e);return json({error:String(e?.message||e)},500)}
});