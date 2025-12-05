import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

// Külön axios instance a token refresh-hez, hogy ne menjen végtelen ciklusba
const refreshApi = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

// Flag a refresh folyamat követésére
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Ha nincs response vagy nem 401-es, dobjuk tovább a hibát
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Ha ez már egy retry kísérlet volt, dobjuk tovább
    if (originalRequest._retry) {
      console.log('❌ Már próbálkoztunk ezzel a kéréssel, nem próbálkozunk újra');
      return Promise.reject(error);
    }

    console.log('🔴 401 Unauthorized - Token refresh szükséges');

    // Ha épp folyamatban van egy refresh, várjuk meg
    if (isRefreshing) {
      console.log('⏳ Várakozás a folyamatban lévő token refresh-re...');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        console.log('✅ Token megérkezett a queue-ból, újrapróbáljuk a kérést');
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refresh_token');

    // Ha nincs refresh token, irány a login
    if (!refreshToken) {
      console.log('❌ Nincs refresh token, átirányítás login-ra');
      isRefreshing = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];

      // Ha már a login oldalon vagyunk, ne irányítsunk újra
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    try {
      console.log('🔄 Token refresh indítása...');
      // FONTOS: refreshApi-t használunk, nem api-t!
      const res = await refreshApi.post('/token/refresh/', { refresh: refreshToken });
      const newAccessToken = res.data.access;

      console.log('✅ Token sikeresen frissítve!');
      localStorage.setItem('access_token', newAccessToken);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
      originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

      processQueue(null, newAccessToken);
      isRefreshing = false;

      console.log('🔁 Eredeti kérés újrapróbálása új tokennel');
      return api(originalRequest);
    } catch (refreshError) {
      console.log('❌ Token refresh sikertelen, kijelentkeztetés...');
      // Ha a refresh token is lejárt
      processQueue(refreshError, null);
      isRefreshing = false;

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];

      // Ha már a login oldalon vagyunk, ne irányítsunk újra
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    }
  }
);


export default api
