"use client";
import { FC, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import InputField from "@/components/fields/InputField";
import Checkbox from "@/components/checkbox/index2";
import FixedPlugin from "@/components/fixedPlugin/FixedPlugin";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import ParticlesBackground from "@/components/Particle";
import { UsersOperation } from "@/library/account";
import { RouteOperation } from "@/library/route";
import NotiPopup from "@/components/notification";
import { useRouter } from "next/navigation";
import { DriverOperation, DriverRegister } from "@/library/driver";
import { vehicle, VehicleOperation } from "@/library/vehicle";
type Props = {};

const AuthPage: FC<Props> = () => {
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [form, setForm] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();
  const user = new UsersOperation();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleCheckField = () => {
    if (form === "signin" || form === "signup") {
      if (!email || !password) {
        setError(true);
        setMessage("Vui lòng nhập đầy đủ email và mật khẩu!");
        setModal(true);
        return true;
      } else if (!validateEmail(email)) {
        setError(true);
        setMessage("Vui lòng nhập đúng định dạng email!");
        setModal(true);
        return true;
      }
      return false;
    } else {
      if (!email) {
        setError(true);
        setMessage("Vui lòng nhập đầy đủ email để lấy lại mật khẩu!");
        setModal(true);
        return true;
      } else if (!validateEmail(email)) {
        setError(true);
        setMessage("Vui lòng nhập đúng định dạng email!");
        setModal(true);
        return true;
      }
      return false;
    }
  };

  const handleSignUpButton = async () => {
    if (handleCheckField()) return;
    const response = await user.handleSignUp({ email, password });
    if (response.error) {
      setMessage("Đã có lỗi xảy ra! Vui lòng kiểm tra tài khoản/mật khẩu hoặc đăng ký để tạo tài khoản.");
      setError(true);
      setModal(true);
    } else {
      setMessage("Đăng ký thành công");
      setModal(true);
    }
  };

  const handleSignInButton = async () => {
    if (handleCheckField()) return;
    const response = await user.handleSignIn({ email, password });
    if (response.error) {
      setMessage("Đã có lỗi xảy ra! Vui lòng kiểm tra tài khoản/mật khẩu. Nếu bạn đã đăng ký, vui lòng nhấp vào đăng nhập.");
      setError(true);
      setModal(true);
    } else {
      setMessage("Đăng nhập thành công");
      setModal(true);
    }
  };

  const handleForgotPw = async () => {
    if (handleCheckField()) return;
    const response = await user.handleForgotPass({ email });
    if (response.error) {
      setMessage("Đã có lỗi xảy ra! Vui lòng kiểm tra lại email hoặc tạo tài khoản mới.");
      setError(true);
      setModal(true);
    } else {
      setMessage("Mật khẩu đã được gửi vô mail của bạn!");
      setModal(true);
    }
  };

  const handleSignInByGoogle = async (): Promise<void> => {
    const response = await user.handleAuth();
    if (response && !response.error) {
      setMessage("Đăng nhập thành công");
      setModal(true);
    } else {
      setMessage("Đã có lỗi xảy ra! Vui lòng chọn tài khoản để đăng nhập hoặc tải lại trang rồi thử lại.");
      setError(true);
      setModal(true);
    }
  };

  const handleNotificationClose = async () => {
    setModal(false);
    if (!error) {
      route.push("/data");
    } else setError(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (form === "signin") handleSignInButton();
        else if (form === "signup") handleSignUpButton();
        else if (form === "forgotPw") handleForgotPw();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [form, email, password]);

  useEffect(() => {
    const fetchData = async () => {
      const loggedIn2 = await user.checkUserLoggedIn();
      if (loggedIn2) await user.onClickLogOut();
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   const route=new RouteOperation();
  //   console.log(route.viewAllRoute());
  // },[])
  // useEffect(() => {
  //   const handleTestApi = async () => {
  //    const User2 = new DriverOperation()
  //   //  const response =await User2.deleteRouteByID("UO6EM0o9EQIE6be61gMT");
  //   const response =await User2.deleteDriverByID("h6zeohDMAbzn8qg7gM13")
  //    console.log("hello")
  //     console.log(response)
  //   };

  //   handleTestApi()
  // }, [ ]);
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <ParticlesBackground />
        {modal && (
          <NotiPopup message={message} onClose={handleNotificationClose} />
        )}
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex h-screen">
            <div className="mx-auto flex min-h-full h-full w-full flex-col justify-start">
              <div className="flex lg:w-[51vw] 2xl:w-[45vw] items-center justify-center lg:items-center lg:justify-start h-full px-4 sm:px-8 md:px-16 lg:px-28">
                {/* Sign in section */}
                <div className="w-full flex-col items-center md:pl-4 lg:pl-0">
                  <div className="flex justify-between">
                    <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                      {form == "signin" ? (
                        <>Đăng nhập</>
                      ) : form == "signup" ? (
                        <>Đăng ký</>
                      ) : (
                        <>Quên mật khẩu</>
                      )}
                    </h4>
                    <FixedPlugin />
                  </div>

                  <p className="mb-9 ml-1 text-base text-gray-600">
                    {form == "signin" ? (
                      <>Nhập email và mật khẩu để đăng nhập!</>
                    ) : form == "signup" ? (
                      <>Nhập email và mật khẩu để đăng ký!</>
                    ) : (
                      <>Nhập email để lấy lại mật khẩu.</>
                    )}
                  </p>
                  <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
                    <button
                      onClick={handleSignInByGoogle}
                      className="flex items-center gap-2"
                    >
                      <FcGoogle />
                      <span className="text-sm font-medium text-navy-700 dark:text-white">
                        Đăng nhập bằng Google
                      </span>
                    </button>
                  </div>
                  <div className="mb-6 flex items-center  gap-3">
                    <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
                    <p className="text-base text-gray-600 dark:text-white">
                      {" "}
                      hoặc{" "}
                    </p>
                    <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
                  </div>

                  {/* Email */}
                  <InputField
                    variant="auth"
                    extra="mb-3"
                    label="Email*"
                    placeholder="email@hcmut.edu.vn"
                    id="email"
                    type="text"
                    value={email}
                    setValue={setEmail}
                    className="bg-white dark:!bg-navy-900"
                  />

                  {/* Password */}
                  {form != "forgotPw" && (
                    <InputField
                      variant="auth"
                      extra="mb-3"
                      label="Mật khẩu*"
                      placeholder="Tối thiểu 8 ký tự"
                      id="password"
                      type="password"
                      value={password}
                      setValue={setPassword}
                      className="bg-white dark:!bg-navy-900"
                    />
                  )}

                  {/* Checkbox */}
                  <div className="mb-4 flex items-center justify-between px-2">
                    <div
                      className={`flex items-center ${form != "forgotPw" ? "visible" : "invisible"
                        }`}
                    >
                      <Checkbox id="remember-me" />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 text-sm font-medium text-navy-700 dark:text-white"
                      >
                        Lưu đăng nhập
                      </label>
                    </div>
                    <button
                      className={`text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white ${form != "forgotPw" ? "visible" : "invisible"
                        }`}
                      onClick={() => setForm("forgotPw")}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (form === "signin") handleSignInButton();
                      else if (form === "signup") handleSignUpButton();
                      else if (form === "forgotPw") handleForgotPw();
                    }}
                    className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  >
                    {form == "signin" ? (
                      <>Đăng nhập</>
                    ) : form == "signup" ? (
                      <>Đăng ký tài khoản</>
                    ) : (
                      <>Lấy lại mật khẩu</>
                    )}
                  </button>

                  <div className="mt-4">
                    <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
                      {form == "signin" ? (
                        <>Chưa đăng ký?</>
                      ) : form == "signup" ? (
                        <>Đã có tài khoản?</>
                      ) : (
                        <>Chưa đăng ký?</>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        setForm(
                          form == "signin"
                            ? "signup"
                            : form == "signup"
                              ? "signin"
                              : "signup"
                        );
                      }}
                      className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                    >
                      {form == "signin" ? (
                        <>Tạo tài khoản</>
                      ) : form == "signup" ? (
                        <>Đăng nhập</>
                      ) : (
                        <>Tạo tài khoản</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 hidden h-screen lg:block lg:w-[49vw] 2xl:w-[55vw]">
                <Carousel
                  additionalTransfrom={0}
                  draggable
                  keyBoardControl
                  autoPlay
                  showDots={false}
                  autoPlaySpeed={3000}
                  shouldResetAutoplay={true}
                  swipeable
                  minimumTouchDrag={80}
                  responsive={{
                    res1: {
                      breakpoint: { max: 40000, min: 0 },
                      items: 1,
                      partialVisibilityGutter: 0,
                    },
                  }}
                  containerClass="flex h-full w-full"
                  rewind={true}
                  pauseOnHover={false}
                  rewindWithAnimation={true}
                  arrows={false}
                  transitionDuration={1000}
                >
                  <div className="h-screen">
                    <Image
                      src={"/img/auth/auth.png"}
                      alt={`Image`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="h-screen">
                    <Image
                      src={"/img/auth/hcmut.jpg"}
                      alt={`Image`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthPage;
