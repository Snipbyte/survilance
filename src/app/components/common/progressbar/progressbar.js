// components/common/ProgressBar.js
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-slateColor rounded-full h-4">
    <div
      style={{ width: `${progress}%` }}
      className="bg-blueColor h-full rounded-full transition-width duration-300"
    ></div>
  </div>
);

export default ProgressBar;
