import OpenAI from "openai";
import fs from "node:fs";
import PocketBase from "pocketbase";
import eventsource from 'eventsource';
global.EventSource = eventsource;

const openai = new OpenAI({ apiKey: "sk-None-oBBwp2KXurrQSZEaqDGST3BlbkFJ0o9LvP9UMKoPe3RGn5W3" });

async function main() {
  const image = await openai.images.generate({
    prompt: `


` })
  console.log(image.data[0].url);
  // const rbgResultData = await removeBg(image.data[0].url);
  // fs.writeFileSync("no-bg.png", Buffer.from(rbgResultData));
}

async function removeBg(imageURL) {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_url", imageURL);

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": "bFqEBbkxecpy6WLPjPY6oGmn" },
    body: formData,
  });

  if (response.ok) {
    return await response.arrayBuffer();
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

main()
