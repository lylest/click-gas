import './empty.css'

function Empty({ label, Icon }) {
  return (
    <div className='empty-center' style={{ marginTop: '6%'}}>
       <Icon size={60} color="#666" className='center-icon' />
        <p>{label}</p>
    </div>
  )
}

export default Empty