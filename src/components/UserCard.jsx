function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.photo} alt={user.name} className="user-photo" />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.company}</p>
      <p>{user.phone}</p>
    </div>
  )
}

export default UserCard
