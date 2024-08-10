import React from 'react';
import Header from '../components/Header';

interface Projects {
    id: number;
    name: string;
    description: string;
}

const projects: Projects[] = [
    { id: 1, name: 'Project 1', description: 'Description of Project 1' },
    { id: 2, name: 'Project 2', description: 'Description of Project 2' },
    { id: 3, name: 'Project 3', description: 'Description of Project 3' },
    // Add more projects here
];

const Projects: React.FC = () => {
    return (
        <>
            <Header></Header>
            <div className="text-default-800">
                <h1>Projects</h1>
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Projects;