import React, { useEffect, useState } from "react";
import "./todo.css";
import TodoCards from "./TodoCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Update from "./Update";
import axios from "axios";



let id = sessionStorage.getItem("id");



let toUpdateArray = [];

const Todo = () => {


  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
    date:""
  });

  const [Array, setArray] = useState([]);

  const show = () => {
    document.getElementById("textarea").style.display = "block";
  };


  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async () => {

           console.log(id)


    if (Inputs.title === "" || Inputs.body === "" || Inputs.date === "") {
      toast.error("Title ,  Body or date  Can't Be Empty");
    } else {
      if (id) {
        await axios
          .post(`https://041ybu7bv5.execute-api.ap-south-1.amazonaws.com/api/v2/addTask`, {
            title: Inputs.title,
            body: Inputs.body,
            date: Inputs.date,
            id: id,
          })
          .then((response) => {
            console.log(response);
          });
        setInputs({ title: "", body: "" , date: "" });
        toast.success("Your Task Is Added");
      } else {
        setArray([...Array, Inputs]);
        setInputs({ title: "", body: "" });
        toast.success("Your Task Is Added");
        toast.error("Your Task Is Not Saved ! Please SignUp");
      }
    }



  };

  const del = async (Cardid) => {
    

    if (id) {
      await axios
        .delete(`https://041ybu7bv5.execute-api.ap-south-1.amazonaws.com/api/v2/deleteTask/${Cardid}`, {
          data: { id: id },
        })
        .then(() => {
          toast.success("Your Task Is Deleted");
        });
    } else {
      toast.error("Please SignUp First");
    }
  };

  const dis = (value) => {
    document.getElementById("todo-update").style.display = value;
  };



  const update = (value) => {
    toUpdateArray = Array[value];
    console.log(toUpdateArray);
  };




  const fetchData = async () => {
    try {
      if (id) {
        const response = await axios.get(`https://041ybu7bv5.execute-api.ap-south-1.amazonaws.com/api/v2/getTasks/${id}`);
        setArray(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submit, del]);
  

  
  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              name="title"
              value={Inputs.title}
              onChange={change}
            />
            <input
              type="text"
              placeholder="body"
              className="my-2 p-2 todo-inputs"
              name="body"
              value={Inputs.body}
              onChange={change}
            />

            <input
              type="date"
              placeholder="date"
              className="my-2 p-2 todo-inputs"
              name="date"
              value={Inputs.date}
              onChange={change}
            />


          </div>
          <div className=" w-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={submit}>
              Add
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row ">
              {Array &&
                Array.map((item, index) => (
                  <div
                    className="col-lg-3 col-11 mx-lg-5 mx-3 my-2"
                    key={index}
                  >
                    <TodoCards
                      title={item.title}
                      body={item.body}
                      date={item.date}
                      id={item._id}
                      delid={del}
                      display={dis}
                      updateId={index}
                      toBeUpdate={update}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="todo-update " id="todo-update">
        <div className="container update">
          <Update display={dis} update={toUpdateArray} />
          {/* <Update update={toUpdateArray} /> */}
        </div>
      </div>
    </>
  );
};

export default Todo;
