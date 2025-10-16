// components/common/Alert.js
const Alert = ({ type = "info", message }) => {
    const colors = {
      success: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
      info: "bg-blue-100 text-blueColor",
    };
  
    return (
      <div className={`p-4 rounded-md ${colors[type]} my-2`}>
        {message}
      </div>
    );
  };
  
  export default Alert;
  