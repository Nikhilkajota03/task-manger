import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";




const Update = ({ display, update }) => {

  


// console.log(update)


  useEffect(() => {
    setInputs({
      title: update.title,
      body:  update.body,
      date:  update.date
    });
  }, [update]);

  


  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });

  


  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };


  const submit = async () => {

    try {


      const updateitem = await axios
      .put(`https://041ybu7bv5.execute-api.ap-south-1.amazonaws.com/api/v2/updateTask/${update._id}`, Inputs)
      .then((response) => {
        toast.success(response.data.message);
      });

      display("none")
      
    } catch (error) {
      
    }
  ;
  };



  return (
    <div className="p-5  d-flex justify-content-center align-items-start flex-column update  ">
      <h3>Update Your Task</h3>
      <input
        type="date"
        className="todo-inputs my-1 w-100 p-3"
        value={Inputs.date}
        name="date"
        onChange={change}
      />
      <input
        type="text"
        className="todo-inputs my-3 w-100 p-3"
        value={Inputs.title}
        name="title"
        onChange={change}
      />
      <textarea
        className="todo-inputs w-100 p-3"
        value={Inputs.body}
        name="body"
        onChange={change}
      />
      <div>
        <button className="btn btn-dark my-4" onClick={submit}>
          UPDATE
        </button>
        <button
          className="btn btn-danger my-4 mx-3"
          onClick={() => {
            display("none");
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;
