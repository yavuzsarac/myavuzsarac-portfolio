import { Link } from 'react-router-dom';

const ProjectCard = ({ id, title, description, tags, imageUrl }) => {
  return (
    <Link to={`/proje/${id}`} className="project-card">
      {/* Eğer bir fotoğraf yoksa boş bir gri alan görünür */}
      <img src={imageUrl || "https://via.placeholder.com/400x200?text=Proje+Gorseli"} alt={title} className="project-image" />
      
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        
        <div className="project-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;