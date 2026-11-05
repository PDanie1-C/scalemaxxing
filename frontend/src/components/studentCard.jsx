import '../styles/style.css';

function StudentCard({id, name, image, role}) {
  return (
    <div className="student-card">
      <div className='student-image'>
        <img src={image} alt=""></img>
      </div>
      <div>
        <p className="student-name">{name}</p>
        <p className='student-role'>{role}</p>
      </div>
      
    </div>
  );
}

export default StudentCard;