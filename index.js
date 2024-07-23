import OpenAI from "openai";
import fs from "node:fs";
import PocketBase from "pocketbase";
import eventsource from 'eventsource';
global.EventSource = eventsource;

const openai = new OpenAI({ apiKey: "sk-None-oBBwp2KXurrQSZEaqDGST3BlbkFJ0o9LvP9UMKoPe3RGn5W3" });

async function main() {
  const image = await openai.images.generate({ prompt: "A whimsy cartoon frog sticker illustration isolated on a solid black background. The fro in the sticker is depicted in a watercolor style with dark and vibrant colors. Add gothic magic elements to the frog such as dark flowers, black feathers, amethyst crystals, and withered leaves. Ensure that the frog is centered and fits within the sticker's borders. The sticker should have a white border and a clipart-like appearance, embodying a mystical and enchanting vibe." })
  console.log(image.data[0].url);
  const rbgResultData = await removeBg(image.data[0].url);
  fs.writeFileSync("no-bg.png", Buffer.from(rbgResultData));
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

const pb = new PocketBase('https://pocketbase.frank.gdn');
pb.collection("items").subscribe('*', async (e) => {
  try {
    if (e.action === "create") {
      await main()
      const formData = new FormData()
      formData.append("image", new Blob([fs.readFileSync("./no-bg.png")]), "froggy.png");
      const record = await pb.collection('items').update(e.record.id, formData);
      console.log(record)
    } else {
      console.log("Its updated")
      fs.unlink("./no-bg.png", () => console.log("Its cleaned up"))
    }
  } catch (e) {
    console.log(e)
  }
})
