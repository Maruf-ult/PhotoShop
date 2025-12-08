import Navbar from "../../components/header/Navbar";
import bg_image from "../../images/bg_image.jpg";

function Home() {
  return (
    <>
      <Navbar />
      <div className=" h-screen flex items-center justify-center   bg-center bg-gray-800 ">
        <div
          className="flex items-center bg-center bg-cover text-white px-[415px] py-[212px] mt-18 rounded-xl "
          style={{ backgroundImage: `url(${bg_image})` }}
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              Share and Discover Creativity
            </h1>
            <p className="font-semibold">
              Join a vibrant community of photographers and explore stunning
              visuals from <br /> around the world.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-blue-500 px-4 py-2 rounded-md">
                Start Uploading
              </button>
              <button className="bg-blue-100 text-black px-4 py-2 rounded-md">
                Browse Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
