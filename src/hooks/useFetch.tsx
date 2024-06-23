import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/BASE_URL";
export interface Task {
    id: string;
    title: string;
    isDone: boolean;
}

export interface TaskResponse {
    data: Task[] | null;
    total: number;
    totalPages: number;
    currentPage: number;
}

const ITEMS_PER_PAGE: number = 15;

const useFetch = (initialState: TaskResponse | null, path: string) => {
    const [data, setData] = useState<TaskResponse | null>(initialState);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${BASE_URL}${path}?_page=1&_limit=${ITEMS_PER_PAGE}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const totalCount = Number(response.headers.get("X-Total-Count"));
                const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
                const json = await response.json();
                const taskResponse: TaskResponse = {
                    data: json,
                    total: totalCount,
                    totalPages: totalPages,
                    currentPage: 1,
                };
                setData(taskResponse);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
                setIsError(true);
            }
        };

        fetchData();
    }, [path]);

    const fetchDataWithPage = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}${path}?_page=${page}&_limit=${ITEMS_PER_PAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const totalCount = Number(response.headers.get("X-Total-Count"));
            const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
            const json = await response.json();
            const taskResponse: TaskResponse = {
                data: json,
                total: totalCount,
                totalPages: totalPages,
                currentPage: page,
            };
            setData(taskResponse);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
            setIsError(true);
        }
    };

    const goToNextPage = () => {
        if (data && data.currentPage < data.totalPages) {
            const nextPage = data.currentPage + 1;
            fetchDataWithPage(nextPage);
        }
    };

    const goToPrevPage = () => {
        if (data && data.currentPage > 1) {
            const prevPage = data.currentPage - 1;
            fetchDataWithPage(prevPage);
        }
    };

    const goToFirstPage = () => {
        fetchDataWithPage(1);
    };

    const goToLastPage = () => {
        if (data) {
            fetchDataWithPage(data.totalPages);
        }
    };

    return {
        data,
        isLoading,
        isError,
        currentPage: data ? data.currentPage : 1,
        goToNextPage,
        goToPrevPage,
        goToFirstPage,
        goToLastPage,
    };
};

export default useFetch;
