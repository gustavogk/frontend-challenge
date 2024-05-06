"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import bio from "../../../public/bio.svg";
import math from "../../../public/math.svg";
import red from "../../../public/red.svg";
import phys from "../../../public/phys.svg";
import book from "../../../public/book.svg";

const coursesData = [
  {
    id: 1,
    title: "Pré-Vestibular",
    description:
      "Curso preparatório para o vestibular abordando os principais conteúdos de todas as disciplinas.",
    category: "Pré-Vestibular",
    instructor: "Professores especializados",
    image: book,
  },
  {
    id: 2,
    title: "Biologia",
    description:
      "Estudo dos seres vivos, sua estrutura, função, evolução e distribuição.",
    category: "Biologia",
    instructor: "Dra. Ana Souza",
    image: bio,
  },
  {
    id: 3,
    title: "Redação",
    description:
      "Aprimoramento da escrita por meio de técnicas de produção textual e prática de redação.",
    category: "Redação",
    instructor: "Prof. Marcos Oliveira",
    image: red,
  },
  {
    id: 4,
    title: "Matemática",
    description:
      "Estudo dos números, suas operações, estruturas algébricas e suas aplicações.",
    category: "Matemática",
    instructor: "Prof. Carlos Mendes",
    image: math,
  },
  {
    id: 5,
    title: "Física",
    description:
      "Estudo das leis que regem o comportamento dos corpos e das forças que os afetam.",
    category: "Física",
    instructor: "Prof. Laura Torres",
    image: phys,
  },
];

const CourseList = ({ courses }) => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userCourses, setUserCourses] = useState([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    const registrations =
      JSON.parse(localStorage.getItem("registrations")) || [];
    const userRegistrations = registrations.filter(
      (registration) => registration.email === loggedInUser
    );
    const userCourseIds = userRegistrations.map(
      (registration) => registration.materia_id
    );
    setUserCourses(userCourseIds);
  }, []);

  const filteredCourses =
    categoryFilter === "all"
      ? courses
      : courses.filter((course) => course.category === categoryFilter);

  const handleAccountEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    if (password !== confirmPassword) {
      alert("A senha e a confirmação de senha não coincidem.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = existingUsers.findIndex(
      (user) => user.email === localStorage.getItem("loggedInUser")
    );
    if (userIndex === -1) {
      alert("Usuário não encontrado.");
      return;
    }

    existingUsers[userIndex].email = email;
    existingUsers[userIndex].password = password;

    localStorage.setItem("users", JSON.stringify(existingUsers));

    localStorage.setItem("loggedInUser", email);

    alert("Alterações salvas com sucesso.");

    handleCloseModal();
  };

  const handleSubscribe = (materiaId) => {
    const email = localStorage.getItem("loggedInUser");

    if (!email) {
      alert("Você precisa estar logado para se inscrever em um curso.");
      return;
    }

    const registrations =
      JSON.parse(localStorage.getItem("registrations")) || [];
    const isAlreadySubscribed = registrations.some(
      (registration) =>
        registration.email === email && registration.materia_id === materiaId
    );

    if (isAlreadySubscribed) {
      alert("Você já está inscrito neste curso!");
      return;
    }

    const newRegistration = { email, materia_id: materiaId };
    registrations.push(newRegistration);
    localStorage.setItem("registrations", JSON.stringify(registrations));

    setUserCourses([...userCourses, materiaId]);

    alert("Inscrição realizada com sucesso!");
  };

  const handleCancelSubscription = (courseId) => {
    const updatedUserCourses = userCourses.filter((id) => id !== courseId);
    setUserCourses(updatedUserCourses);

    const loggedInUser = localStorage.getItem("loggedInUser");
    const registrations =
      JSON.parse(localStorage.getItem("registrations")) || [];
    const updatedRegistrations = registrations.filter(
      (registration) =>
        !(
          registration.email === loggedInUser &&
          registration.materia_id === courseId
        )
    );
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

    alert("Inscrição cancelada com sucesso!");
  };

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cursos Disponíveis</h2>
          <button
            onClick={handleAccountEdit}
            className="bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded"
          >
            Editar Conta
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="mr-2">
            Filtrar por categoria:
          </label>
          <select
            id="category"
            className="p-2 border rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="Pré-Vestibular">Pré-Vestibular</option>
            <option value="Biologia">Biologia</option>
            <option value="Redação">Redação</option>
            <option value="Matemática">Matemática</option>
            <option value="Física">Física</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <p className="text-gray-600 italic mb-2">
                Categoria: {course.category}
              </p>
              <p className="text-gray-600 italic mb-4">
                Instrutor: {course.instructor}
              </p>
              <Image
                width={100}
                height={100}
                src={course.image}
                alt={course.title}
                className="mb-4"
              />
              <button
                className="block bg-primary-600 hover:bg-primary-700 text-white text-center py-2 rounded w-full "
                onClick={() => handleSubscribe(course.id)}
              >
                Inscrever-se
              </button>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Editar Conta</h2>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="p-2 border rounded bg-gray-100 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Senha:
                </label>
                <input
                  type="password"
                  id="password"
                  className="p-2 border rounded bg-gray-100 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirmar Senha:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="p-2 border rounded bg-gray-100 w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Cursos Matriculados:
                </p>
                <ul>
                  {userCourses.map((courseId) => {
                    const course = coursesData.find(
                      (course) => course.id === courseId
                    );
                    return (
                      <li key={courseId} className="mb-2">
                        <h3 className="text-lg font-bold">{course.title}</h3>
                        <p className="text-gray-700">{course.description}</p>
                        <button
                          onClick={() => handleCancelSubscription(course.id)}
                          className="text-red-600 text-sm font-medium"
                        >
                          Cancelar Inscrição
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                onClick={handleSaveChanges}
                className="mr-4 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded"
              >
                Salvar Alterações
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-center py-2 px-4 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Courses = () => {
  return (
    <div>
      <CourseList courses={coursesData} />
    </div>
  );
};

export default Courses;
