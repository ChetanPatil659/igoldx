import Client from "./client";

export async function loginApi(number) {
  try {
    const res = await Client.post("/auth/user/login", { phone: number });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function verifyOtpApi(number, otp, deviceId) {
  try {
    const res = await Client.post("/auth/user/verify-otp", {
      phone: number,
      otp: otp,
      deviceId: deviceId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function completeProfileApi(token, name, pincode) {
  try {
    const res = await Client.put("/auth/user/complete-safegold", {
      name,
      pincode,
    },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function addNameApi(token, name) {
  try {
    const res = await Client.put("/auth/user/complete-name", {
      name,
    },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function addAgeApi(token, age) {
  try {
    const res = await Client.put("/auth/user/complete-age", {
      age,
    },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function addGenderApi(token, gender) {
  try {
    const res = await Client.put("/auth/user/complete-gender", {
      gender,
    },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function addAddressApi(token, city, state, street, zip, name, phoneNumber) {
  try {
    const res = await Client.post("/auth/user/add-address", {
      city,
      state,
      street,
      zip,
      name,
      phoneNumber,
    },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchBalanceApi(token) {
  try {
    const res = await Client.get("/gold/fetch-balance", {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchUserApi(token) {
  try {
    const res = await Client.get("/auth/user/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchGoldPriceApi() {
  try {
    const res = await Client.get("/gold/gold-price");
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
