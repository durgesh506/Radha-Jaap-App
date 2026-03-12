function MantraInput({mantra, setMantra}) {

  return (
    <input
      value={mantra}
      onChange={(e)=>setMantra(e.target.value)}
      placeholder="Enter Mantra"
    />
  )

}

export default MantraInput