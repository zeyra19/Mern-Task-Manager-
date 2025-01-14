import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const UserContext = React.createContext();

// Backend çerezlerle çalıştığı için
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "https://taskfyer.onrender.com";

  const router = useRouter();
  //  Bir kullanıcı bilgisi saklamak istiyoruz {}
  //  {
  //  username: "Zehra",
  //  email: "zehra@example.com",
  //  password: "123456"
  //  }
  const [user, setUser] = useState({});
  //  Birden fazla kullanıcı veya bir listede saklamak istiyoruz
  // [
  //  { id: 1, username: "zehra123", email: "zehra@example.com" },
  //  { id: 2, username: "ogulcan456", email: "ogulcan@example.com" }
  // ]
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
  // formun otomatik gönderilmesini ve sayfanın yenilenmesini engellemek için
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Lütfen geçerli bir email ve şifre girin (minimum 6 karakter)");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
      console.log("Kullanıcı kaydı başarıyla oluşturuldu", res.data)
      toast.success("Kullanıcı kaydı başarıyla oluşturuldu");

      setUserState({
        name: "",
        email: "",
        password: "",
      });

      router.push("/login");
    } catch (error) {
      console.log("Kullanıcı kaydı oluşmadı", error);
      toast.error(error.response.data.message);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Kullanıcı Login oldu")

      setUserState({
        email: "",
        password: "",
      });

      await getUser();

      router.push("/");
    } catch (error) {
        console.log("Kullanıcı login olamadı:(");
        toast.error(error.response.data.message);
    }
  };

  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true,
      });

      loggedIn = !!res.data;
      setLoading(false);

      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error) {
        console.log("Login bilgilerini getirirken hata oluştu", error);
    }

    return loggedIn;
  };

  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });

      toast.success("Kullanıcı çıkışı başarılı :)");
      // Çıkış yapıldığında, bu bilgileri temizle
      setUser({});

      router.push("/login");
    } catch (error) {
        console.log("Kullanıcı çıkışı başarısız", error);
        toast.error(error.response.data.message);
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`, {
        withCredentials: true,
      });

      // API'den alınan yeni veriyi mevcut duruma ekler.
      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      setLoading(false);
    } catch (error) {
        console.log("Kullanıcı bilgisini alamadım", error)
        setLoading(false);
        toast.error(error.response.data.message);
    }
  };

  const updateUser = async (e, data) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true,
      });

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success("Kullanıcı başarıyla güncellendi");
      setLoading(false);
    } catch (error) {
      console.log("Kullanıcı bilgisi güncellenemedi", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const emailVerification = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verify-email`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Emailinizi kontrol ediniz");
      setLoading(false);
    } catch (error) {
        console.log("Email doğrulaması gönderilemedi", error);
        setLoading(false);
        toast.error(error.response.data.message);
    }
  };

  const verifyUser = async (token) => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verify-user/${token}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Kullanıcı doğrulama başarılı");

      // USer bilgilerini yenile
      getUser();

      setLoading(false);

      router.push("/");
    } catch (error) {
      console.log("Kullanıcı doğrulama da hata", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const forgotPasswordEmail = async (email) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Emailinizi kontrol ediniz");
      setLoading(false)
    } catch (error) {
      console.log("Şifremi unuttum mailinde hata", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        {
          password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Şifre sıfırlama başarılı");
      setLoading(false);

      router.push("/login");
    } catch (error) {
        console.log("Şifre sıfırlamada hata", error);
        toast.error(error.response.data.message);
        setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      // Mevcut bir kaynağı güncellemek için PATCH
      const res = await axios.patch(
        `${serverUrl}/api/v1/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
        }
      );

      toast.succes("Şifre başarıyla değişitirildi");
      setLoading(false);
    } catch (error) {
        console.log("Şifre değişitirilemedi", error);
        toast.error(error.response.data.message);
        setLoading(false);
    }
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/admin/users`,
        {},
        {
          withCredentials: true,
        }
      );

      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting all users", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/admin/users/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Kullanıcı başarıyla silindi");
      setLoading(false);
      // kullanıcı listesi yenile
      getAllUsers();
    } catch (error) {
      console.log("Kullanıcı silinemedi", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus()

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role])


   return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
      }}
    >
    {children}
    </UserContext.Provider>
   );
};

export const useUserContext = () => {
  return React.useContext(UserContext);
};
