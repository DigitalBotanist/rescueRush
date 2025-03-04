import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchmsg = async () => {
       const response = await fetch('http://localhost:4000/')
       const json = await response.json()
       console.log(json)
       setMessage(json.mssg)
    }
    fetchmsg()
}, [])
  return (
    <>
      <div className="">hello</div>
      <div className="text-primary">{message}</div>
    </>
  );
}


export default App
