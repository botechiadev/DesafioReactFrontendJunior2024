import React from "react";
import useFetch, { TaskResponse } from "./hooks/useFetch";

function App() {
  const {
    data,
    isLoading,
    isError,
    goToNextPage,
    goToPrevPage,
    currentPage,
    goToFirstPage,
    goToLastPage
  } = useFetch(null, "/todos");

  if (isLoading) {
    return <div>Carregando Todos...</div>;
  }

  if (isError) {
    return <div>Error🛑: Erro ao carregar <strong>DATA</strong></div>;
  }

  return (
    <section>
      <h1>Todos</h1>
      {data && data.data && data.data.map(task => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.isDone ? "Completa" : "Pendente"}</p>
        </div>
      ))}
      <div>
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Primeira</button>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={goToNextPage} disabled={!data || currentPage === data.totalPages}>Proxima</button>
        <button onClick={goToLastPage} disabled={!data || currentPage === data.totalPages}>Última</button>
      </div>
      <div>
        Página {currentPage} de {data ? data.totalPages : 1}
      </div>
    </section>
  );
}

export default App