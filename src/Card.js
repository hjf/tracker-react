function Card(props) {
  return (
    <div className={`card ${props.className}`}>
      <header className="card-header">
        <p className="card-header-title">
          {props.title}
        </p>
        <a href="#" className="card-header-icon" aria-label="more options">
          <span className="icon">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </a>
      </header>
      <div className="card-content">
        <div className="content">
          {props.children}
        </div>
      </div>
      {/* <footer className="card-footer">
        <a href="#" className="card-footer-item">Save</a>
        <a href="#" className="card-footer-item">Edit</a>
        <a href="#" className="card-footer-item">Delete</a>
      </footer> */}
    </div>
  )
}

export { Card }