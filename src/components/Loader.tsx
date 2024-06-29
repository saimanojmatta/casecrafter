type Props = {};
const Loader = (props: Props) => {
  return (
    <>
      <div className="m-24 flex flex-col items-center justify-center gap-6">
        <div className="loader"></div>
        <h1 className="text-bold text-2xl text-green-600">
          Image Cropping....
        </h1>
      </div>
    </>
  );
};
export default Loader;
