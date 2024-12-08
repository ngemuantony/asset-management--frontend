import { useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout, refreshTokenThunk } from '../store/slices/authSlice';
import type { AppDispatch } from '../store/store';

export const useAxios = (): AxiosInstance => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, refreshToken } = useSelector(
    (state: RootState) => state.auth
  );

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await dispatch(refreshTokenThunk()).unwrap();
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            dispatch(logout());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, dispatch, axiosInstance]);

  return axiosInstance;
};
