import '../styles/style.css';

function StudentCard({id, name, image}) {
  return (
    <div className="student-card">
      <div >
        <img className="student-image" src={image} alt=""></img>
      </div>
      <p className="student-name">{name}</p>
    </div>
  );
}

export default StudentCard;