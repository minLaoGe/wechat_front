import {CLIENTID} from "@/common/const";

export type RequestModel = {
  params?: object;
  headers?: object;
  signal?: AbortSignal;
};

export type RequestWithBodyModel = RequestModel & {
  body?: object | FormData;
};

export const useFetch = () => {
  const handleFetch = async (
    url: string,
    request: any,
    signal?: AbortSignal,
  ) => {


    const requestUrl = request?.params ? `${url}${request.params}` : url;



    const requestBody = request?.body
      ? request.body instanceof FormData
        ? { ...request, body: request.body }
        : { ...request, body: JSON.stringify(request.body) }
      : request;
    const headers = {
      ...(request?.headers
        ? request.headers
        : request?.body && request.body instanceof FormData
        ? {}
        : {'Content-type': 'application/json'}),
    };

    return await fetch(requestUrl, { ...requestBody, headers, signal })
      .then((response) => {
        if (!response.ok) throw response;

        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');

        if (contentType && (contentType.indexOf('application/json') !== -1 || contentType.indexOf('text/plain') !== -1)) {
          return response.json().then((data) => {
            // 检查 data 是否是一个对象并且包含 data 属性
            if (data && typeof data === 'object' && 'data' in data) {
              if (data['code'] === '10000'){
                return data.data;
              }else {
                // 如果条件不满足，使用 Promise.reject 来拒绝 promise
                return 'error';
              }

            }
            return data;
          });
        } else if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
          return response.blob();
        } else {
          return response;
        }
      })
      .catch(async (err) => {
        const contentType = err.headers.get('content-type');

        const errResult =
          contentType && contentType?.indexOf('application/problem+json') !== -1
            ? await err.json()
            : err;

        throw errResult;
      });
  };

  return {
    get: async <T>(url: string, request?: RequestModel): Promise<any> => {
      return await handleFetch(url, { ...request, method: 'get' });
    },
    post: async <T>(
      url: string,
      request?: RequestWithBodyModel,
    ): Promise<any> => {
      return await handleFetch(url, { ...request, method: 'post' });
    },
    put: async <T>(url: string, request?: RequestWithBodyModel): Promise<Blob | Response | void> => {
      return handleFetch(url, { ...request, method: 'put' });
    },
    patch: async <T>(
      url: string,
      request?: RequestWithBodyModel,
    ): Promise<Blob | Response | void> => {
      return handleFetch(url, { ...request, method: 'patch' });
    },
    delete: async <T>(url: string, request?: RequestModel): Promise<Blob | Response | void> => {
      return handleFetch(url, { ...request, method: 'delete' });
    },
  };
};
