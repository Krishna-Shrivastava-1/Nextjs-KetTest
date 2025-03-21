// app/page.js (or wherever your page.js is located)
import VideoPlayer from "@/component/VideoPlayer";
import axios from "axios";
import Image from "next/image";

async function getData() {
  try {
    const aboutResponse = await axios.get(
      "https://netfree.cc/pv/post.php?id=0SGEGC629FCXQ5DJ9ORNE42PXK&t=1742478278"
    );
    const mainResponse = await axios.get(
      "https://netfree.cc/pv/playlist.php?id=0SGEGC629FCXQ5DJ9ORNE42PXK&tm=1742481773"
    );

    return {
      aboutur: aboutResponse.data,
      mainurl: mainResponse.data,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      aboutur: null,
      mainurl: null,
    };
  }
}

export default async function Home() {
  const data = await getData();

  // console.log("Main URL:", data.mainurl);
  const vidsrc =  data?.mainurl[0]?.sources[0]?.file
  // console.log("Sources Array:", data?.mainurl[0]?.image);
const actru =  'https://netfree.cc' +vidsrc
  return  <div>
  <div>
    {data?.mainurl[0]?.image ? (
      <Image width="200" height="100" src={data?.mainurl[0]?.image} alt="image" />
    ) : (
      <p>Image not available</p>
    )}
    <h1>{data?.aboutur.title}</h1>
    <p>{data?.aboutur.desc}</p>
    <div><VideoPlayer src={`/api/video?url=${encodeURIComponent(actru)}`} /></div>
  </div>
</div>
}