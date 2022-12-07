import { Form, message } from "antd";
import FormItem from "antd/lib/form/FormItem";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSubmit = async (value) => {
    //console.log(value);
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post("/api/users/login", value);
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(value);
      message.success("Login Berhasil");
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Error!");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);

  return (
    <section class="h-full gradient-form bg-amber-500 md:h-screen">
      <div class="container py-12 px-6 h-full">
        <div class="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div class="xl:w-10/12">
            <div class="block bg-white shadow-lg rounded-lg">
              <div class="lg:flex lg:flex-wrap g-0">
                <div class="lg:w-6/12 px-4 md:px-0">
                  <div class="md:p-12 md:mx-6">
                    <div class="text-center">
                      <img
                        class="mx-auto w-48"
                        src="images/pos.png"
                        alt="logo"
                      />
                      <h4 class="text-xl font-semibold mt-1 mb-12 pb-1">
                        Aplikasi Kasir
                      </h4>
                    </div>
                    <Form layout="vertical" onFinish={handlerSubmit}>
                      <FormItem name="userId" label="Username">
                        <input
                          type="text"
                          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-orange-700 focus:outline-none"
                        />
                      </FormItem>
                      <FormItem name="password" label="Password">
                        <input
                          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-orange-700 focus:outline-none"
                          type="password"
                        />
                      </FormItem>
                      <div className="form-btn-add">
                        <button
                          className="bg-amber-600 inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-amber-800 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-700 ease-in-out w-full mb-3"
                          htmlType="submit"
                        >
                          Login
                        </button>
                        <a class="text-gray-500 hover:text-orange-600" href="#">
                          I forgot my password
                        </a>
                        <br></br>
                      </div>
                    </Form>
                  </div>
                </div>
                <div class="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none bg-cover bg-[url('https://img.freepik.com/premium-vector/people-cozy-cafe-coffee-shop-interior-customers-waitress-vector-illustration_169479-422.jpg?w=2000')]">
                  <div class="text-white px-4 py-6 md:p-12 md:mx-6 brightness-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
