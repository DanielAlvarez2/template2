import {useState, useEffect} from 'react'
import {FaPlusCircle} from 'react-icons/fa'
import {VscSave} from 'react-icons/vsc'
import { MdOutlineToggleOff } from "react-icons/md"
import { FaSquareCaretUp } from "react-icons/fa6"
import { MdClear } from "react-icons/md"
import { BsFillArchiveFill } from "react-icons/bs"
import { PiArrowFatUpFill } from "react-icons/pi"
import { FaCamera } from "react-icons/fa"
import { FaWindowClose } from "react-icons/fa"
import { FaImage } from "react-icons/fa6"

export default function App(){
  const [editMode, setEditMode] = useState(true)
  const [editForm, setEditForm] = useState(false)
  const [editItemPhoto, setEditItemPhoto] = useState('')
  const [dinnerItems, setDinnerItems] = useState([])
  const [hiddenID, setHiddenID] = useState('')
  const [previewSource, setPreviewSource] = useState('')
  const [base64EncodedImage, setBase64EncodedImage] = useState('')
  const [submitText, setSubmitText] = useState(<FaPlusCircle />)
  const [cloudinary_public_id, setCloudinary_public_id] =useState('')
  const [cloudinary_url, setCloudinary_url] =useState('')
  
  function handleFileInputChange(e){
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file) // converts binary image file to a string
    reader.onloadend = ()=> setPreviewSource(reader.result)
    console.log(previewSource)
  }

  function flipSwitch(){
    setEditMode(!editMode)
    if(editMode){
      document.querySelector('.toggle-icon').style.transform = 'rotate(180deg)'
      document.querySelectorAll('.edit-controls').forEach(item=>item.style.display = 'none')
      document.querySelector('.dinner-menu').style.height = '14in'
      document.querySelector('.whitespace-controls').style.display = 'flex'
    }else{
      document.querySelector('.toggle-icon').style.transform = 'rotate(0deg)'
      document.querySelectorAll('.edit-controls').forEach(item=>item.style.display = 'block')
      document.querySelector('.dinner-menu').style.height = 'auto'
      document.querySelector('.whitespace-controls').style.display = 'none'
      document.querySelectorAll('.food-pic').forEach(item=>item.style.display = 'none')
    }
  }
  const getDinnerItems = ()=>{
    fetch('/api/dinner')
      .then(res=>res.json())
      .then(json=>setDinnerItems(json))
      .catch(err=>console.log(err))
  }
  const deleteDinnerItem = (id)=>{
    fetch(`/api/dinner/${id}`, {method:'DELETE'})
      .then(console.log(`Deleted from Database`))
      .then(()=>getDinnerItems())
      .catch(err=>console.log(err))
    clearForm()
    setEditForm(false)
  }
  
  const [marginVertical, setMarginVertical] = useState(0)
  const [paddingHorizontal, setPaddingHorizontal] = useState(0)
  
  function setWhitespace(json){
    console.log(json[0].pixels)
    setMarginVertical(json[0].pixels)
    setPaddingHorizontal(json[1].pixels)
  }
  
  const getWhitespace = ()=>{
    fetch('/api/whitespace')
      .then(async(res)=>await res.json())
      .then(async(json)=>await setWhitespace(json))
      .catch(err=>console.log(err))
  }
  useEffect(()=>getDinnerItems(),[])
  useEffect(()=>getWhitespace(),[])

  async function addDinnerItem(formData){
    let cloudinary_assigned_url = ''
    let cloudinary_assigned_public_id = ''
    console.log(previewSource)

    if (previewSource){
      await fetch('/api/upload-cloudinary', { method:'POST',
        body:JSON.stringify({data:previewSource}),
        headers:{'Content-type':'application/json'}
      })
          .then(async(res)=>await res.json())
          .then(async(json)=>{
          await console.log(json)
          console.log('SECURE_URL: '+json.secure_url)
          console.log('PUBLIC_ID: '+json.public_id)
          cloudinary_assigned_url = json.secure_url
          cloudinary_assigned_public_id = json.public_id
          })
          .catch(err=>console.log(err))
      console.log(...formData)
      setPreviewSource('')
    }
    await fetch('/api/dinner',{ method:'POST',
                                headers:{'Content-Type':'application/json'},
                                body: JSON.stringify({
                                  section: formData.get('section'),
                                  name: formData.get('name'),
                                  allergies: formData.get('allergies'),
                                  preDescription: formData.get('preDescription'),
                                  description: formData.get('description'),
                                  price: formData.get('price'),
                                  cloudinary_url:cloudinary_assigned_url,
                                  cloudinary_public_id:cloudinary_assigned_public_id
                                })
    })
      .then(console.log('Added to Database'))
      .then(async ()=> await getDinnerItems())
      .catch(err=>console.log(err))
  }






  async function updateDinnerItem(formData){
    console.log('************updateDinnerItem(formData)************')
    console.log(...formData)
    




    if  ((!formData.get(cloudinary_url) && !previewSource) 
      || ( formData.get(cloudinary_url) && !previewSource)){
      await fetch(`/api/dinner/${formData.get('id')}`,{ method:'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          section: formData.get('section'),
          name: formData.get('name'),
          allergies: formData.get('allergies'),
          preDescription: formData.get('preDescription'),
          description: formData.get('description'),
          price: formData.get('price'),
          cloudinary_url: formData.get('cloudinary_url'),
          cloudinary_public_id: formData.get('cloudinary_public_id')
        })
      })
        .then(console.log(`Updated: ${formData.get('name')}`))
        .then(setEditForm(false))
        .then(async()=>await getDinnerItems())
        .catch(err=>console.log(err))
      }
    
      




      if(!formData.get(cloudinary_url) && previewSource){
        console.log('no photo -> add photo')
        let cloudinary_assigned_url = ''
        let cloudinary_assigned_public_id = ''
        
        await fetch('/api/upload-cloudinary', { method:'POST',
          body:JSON.stringify({data:previewSource}),
          headers:{'Content-type':'application/json'}
        })
            .then(async(res)=>await res.json())
            .then(async(json)=>{
            await console.log(json)
            console.log('SECURE_URL: '+json.secure_url)
            console.log('PUBLIC_ID: '+json.public_id)
            cloudinary_assigned_url = json.secure_url
            cloudinary_assigned_public_id = json.public_id
            })
            .catch(err=>console.log(err))
        console.log(...formData)
        setPreviewSource('')

        console.log('> '+cloudinary_assigned_url)
        console.log('> '+cloudinary_assigned_public_id)

        await fetch(`/api/dinner/${formData.get('id')}`,{ method:'PUT',
                                    headers:{'Content-Type':'application/json'},
                                    body: JSON.stringify({
                                      section: formData.get('section'),
                                      name: formData.get('name'),
                                      allergies: formData.get('allergies'),
                                      preDescription: formData.get('preDescription'),
                                      description: formData.get('description'),
                                      price: formData.get('price'),
                                      cloudinary_url: cloudinary_assigned_url,
                                      cloudinary_public_id: cloudinary_assigned_public_id
                                    })
        })
          .then(console.log('Item Updated'))
          .then(async ()=> await getDinnerItems())
          .catch(err=>console.log(err))
            
      }    
      
  clearForm()
  }

  function updateForm(id,
                      section,
                      name,
                      allergies,
                      preDescription,
                      description,
                      price,
                      cloudinary_url,
                      cloudinary_public_id){
    setHiddenID(id)
    document.querySelector('#section').value = section
    document.querySelector('#name').value = name
    document.querySelector('#allergies').value = allergies
    document.querySelector('#pre-description').value = preDescription
    document.querySelector('#description').value = description
    document.querySelector('#price').value = price
    if(cloudinary_url) {
      setEditItemPhoto(cloudinary_url)
      setCloudinary_url(cloudinary_url)
      setCloudinary_public_id(cloudinary_public_id)
    }
    setEditForm(true)
    document.querySelector('#dinner-menu-form').scrollIntoView({behavior:'smooth'})
  }

  function increaseVertical(){
    const newVertical = marginVertical + 1
    fetch('/api/whitespace/vertical',{method:'PUT',
                                      headers:{'Content-Type':'application/json'},
                                      body:JSON.stringify({ direction:'vertical',
                                                            pixels:newVertical})
    })
      .then(res=>console.log(res))
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function decreaseVertical(){
    if(marginVertical == 0) return
    const newVertical = marginVertical - 1
    fetch('/api/whitespace/vertical',{method:'PUT',
                                      headers:{'Content-Type':'application/json'},
                                      body:JSON.stringify({ direction:'vertical',
                                                            pixels:newVertical})
    })
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function increaseHorizontal(){
    const newHorizontal = paddingHorizontal + 1
    fetch('/api/whitespace/horizontal',{method:'PUT',
                                        headers:{'Content-Type':'application/json'},
                                        body:JSON.stringify({ direction:'horizontal',
                                                              pixels:newHorizontal
                                        })
    })
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function decreaseHorizontal(){
    if (paddingHorizontal == 0) return
    const newHorizontal = paddingHorizontal - 1
    fetch('/api/whitespace/horizontal',{method:'PUT',
                                        headers:{'Content-Type':'application/json'},
                                        body: JSON.stringify({direction:'horizontal',
                                                              pixels:newHorizontal})
    })
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function clearForm(){
    document.querySelector('#id').value = ''
    document.querySelector('#section').value = 'disabledSelection'
    document.querySelector('#name').value = ''
    document.querySelector('#allergies').value = ''
    document.querySelector('#pre-description').value = ''
    document.querySelector('#description').value = ''
    document.querySelector('#price').value = ''
    document.querySelector('#image-binary').value = ''
    setEditItemPhoto('')
    setPreviewSource('')
  }
  function moveUp(id){
    fetch(`/api/dinner/up/${id}`,{method:'PUT',
                                  headers:{'Content-Type':'application/json'}
    })
    .then(()=>getDinnerItems())
    .catch(err=>console.log(err))
  }
  function moveDown(id){
    fetch(`/api/dinner/down/${id}`,{method:'PUT',
                                    headers:{'Content-Type':'application/json'}
    })
    .then(()=>getDinnerItems())
    .catch(err=>console.log(err))
  }
  function archive(id){
    fetch(`/api/dinner/archive/${id}`,{ method:'PUT',
                                        headers:{'Content-Type':'application/json'}
    })
    .then(()=>getDinnerItems())
    .catch(err=>console.log(err))
  }
  function unarchive(id){
    fetch(`/api/dinner/unarchive/${id}`,{ method:'PUT',
                                          headers:{'Content-Type':'appliation/json'}
    })
    .then(()=>getDinnerItems())
    .catch(err=>console.log(err))
  }
  function showPic(cloudinary_public_id){
    document.querySelector(`#${cloudinary_public_id}`).style.display = 'block'
  }
  function hidePic(cloudinary_public_id){
    document.querySelector(`#${cloudinary_public_id}`).style.display = 'none'
  }














  const lastMeat = dinnerItems.filter(item=>(item.section == 'meats' && item.sequence > 0)).length
  const lastAppetizer = dinnerItems.filter(item=>(item.section == 'appetizers' && item.sequence > 0)).length
  const lastEntree = dinnerItems.filter(item=>(item.section == 'entrees' && item.sequence > 0)).length
  const lastSide = dinnerItems.filter(item=>(item.section == 'sides' && item.sequence > 0)).length











  return(
    <>
    <div className='wrapper'>
    <div className='wrapper-top'>
    <div className='menu-controls no-print'>
      <div className='toggle-mode'>Edit Mode <MdOutlineToggleOff className='toggle-icon' onClick={flipSwitch} /> Print Preview</div> 
      <div className='whitespace-controls'> 
        
        <span className='vertical-controls'>
          <FaSquareCaretUp  className='caret' 
                            onClick={increaseVertical} />
            {marginVertical}
          <FaSquareCaretUp  className='caret' 
                            style={{transform:'rotate(180deg)'}} 
                            onClick={decreaseVertical} />  
        </span>{/* .vertical-controls */}
        
        &nbsp;WHITESPACE&nbsp;  
        
        <span className='horizontal-controls'>
          <FaSquareCaretUp  className='caret' 
                            style={{transform:'rotate(270deg)'}}
                            onClick={decreaseHorizontal} />
            &nbsp;{paddingHorizontal}&nbsp;
          <FaSquareCaretUp  className='caret' 
                            style={{transform:'rotate(90deg)'}} 
                            onClick={increaseHorizontal} /> 
        </span>{/* .horizontal-controls */}

      </div>{/* .whitespace-controls */}
    </div>







    <div className='dinner-menu'>
    <h1>olea</h1>
    <hr/>
    
    
    <div className='appetizersEntrees'>
      <div className='appetizers'>
      <div className='meats'>
      
      {dinnerItems.filter(item=>(item.section == 'meats' && item.sequence > 0)).map(data=>{
        return(
          <div  key={data._id} 
                className='item' 
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            {data.sequence != 1 && <><div className='move-up edit-controls'>
              <PiArrowFatUpFill onClick={()=>moveUp(data._id)}
                                style={{cursor:'pointer'}} />
            </div>{/* .move-up */}</>}
            
            {data.cloudinary_url && <><div  id={data.cloudinary_public_id}
                                            className='edit-controls food-pic'
                                            style={{display:'none',position:'relative'}}>
                                        <img  src={data.cloudinary_url} 
                                              width='100%' />
                                        <FaWindowClose  onClick={()=>hidePic(data.cloudinary_public_id)}
                                                        style={{position:'absolute',
                                                                color:'grey',
                                                                fontSize:'30px',
                                                                top:'5px',
                                                                left:'5px',
                                                                cursor:'pointer',
                                                                }}
                                                    
                                        />
                                      </div></>}
            {data.cloudinary_url && <div className='edit-controls'>
                                      <FaCamera style={{cursor:'pointer'}}
                                                onClick={()=>showPic(data.cloudinary_public_id)} /><br/>
                                    </div> }
            <span className='name'>{data.name}</span>
            {data.name == 'jamón ibérico' ? '' : data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            {data.description ? <span className='description'>{data.description}</span> : '' }
            
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              
              <div className='button-flexbox'>
              <button className='edit-button'                     
                      style={{cursor:'pointer'}}
                      onClick={()=>updateForm(data._id,
                                              data.section,
                                              data.name,
                                              data.allergies,
                                              data.preDescription,
                                              data.description,
                                              data.price,
                                              data.cloudinary_url,
                                              data.cloudinary_public_id)}>
                <i  className='fa-solid fa-pen'></i>
                <span>Edit</span>                
                </button>
              
              <button onClick={()=>archive(data._id)} 
                      className='archive-button'>
                <BsFillArchiveFill />
                <span>Archive</span>
              </button>

              <button className='trash-button' 
                      onClick={()=>deleteDinnerItem(data._id)}
                      style={{cursor:'pointer'}}>
                <i  className='fa-solid fa-trash-can'
                    ></i>
                <span>Delete</span>
              </button>

            </div>{/* .button-flexbox */}
            {data.sequence != lastMeat && <><div className='move-down'>
              <PiArrowFatUpFill onClick={()=>moveDown(data._id)} 
                                style={{cursor:'pointer'}} />
            </div>{/* .move-down */}</>}
            </div>{/* edit-controls */}
          </div>
        )
      })}
    </div>{/* .meats */}


    {dinnerItems.filter(item=>(item.section == 'appetizers' && item.sequence > 0)).map(data=>{
        return(
          <div  key={data._id} 
                className='item'
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            {data.sequence != 1 && <><div className='move-up edit-controls'>
              <PiArrowFatUpFill onClick={()=>moveUp(data._id)} 
                                style={{cursor:'pointer'}} />
            </div>{/* .move-up */}</>}

            {data.cloudinary_url && <><div  id={data.cloudinary_public_id}
                                            className='edit-controls food-pic'
                                            style={{display:'none',position:'relative'}}>
                                        <img  src={data.cloudinary_url} 
                                              width='100%' />
                                        <FaWindowClose  onClick={()=>hidePic(data.cloudinary_public_id)}
                                                        style={{position:'absolute',
                                                                color:'grey',
                                                                fontSize:'30px',
                                                                top:'5px',
                                                                left:'5px',
                                                                cursor:'pointer',
                                                                }}
                                                    
                                        />
                                      </div></>}
            {data.cloudinary_url && <div className='edit-controls'>
                                      <FaCamera style={{cursor:'pointer'}}
                                                onClick={()=>showPic(data.cloudinary_public_id)} /><br/>
                                    </div> }

            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <div className='button-flexbox'>
              <button className='edit-button'                     
                      style={{cursor:'pointer'}}
                      onClick={()=>updateForm(data._id,
                                              data.section,
                                              data.name,
                                              data.allergies,
                                              data.preDescription,
                                              data.description,
                                              data.price,
                                              data.cloudinary_url,
                                              data.cloudinary_public_id)}>
                <i  className='fa-solid fa-pen'></i>
                <span>Edit</span>                
                </button>
              
              <button onClick={()=>archive(data._id)} 
                      className='archive-button'>
                <BsFillArchiveFill />
                <span>Archive</span>
              </button>

              <button className='trash-button' 
                      onClick={()=>deleteDinnerItem(data._id)}
                      style={{cursor:'pointer'}}>
                <i  className='fa-solid fa-trash-can'
                    ></i>
                <span>Delete</span>
              </button>

            </div>{/* .button-flexbox */}
            {data.sequence != lastAppetizer && <><div className='move-down'>
              <PiArrowFatUpFill onClick={()=>moveDown(data._id)} 
                                style={{cursor:'pointer'}} />
            </div>{/* .move-down */}</>}
            </div>{/* edit-controls */}
          </div>
        )
      })}
      </div>{/* appetizers */}

      <div className='entrees'>
      {dinnerItems.filter(item=>(item.section == 'entrees' && item.sequence > 0)).map(data=>{
        return(
          <div  key={data._id} 
                className='item'
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            {data.sequence != 1 && <><div className='move-up edit-controls'>
              <PiArrowFatUpFill onClick={()=>moveUp(data._id)}
                                style={{cursor:'pointer'}} />
            </div>{/* .move-up */}</>}

            {data.cloudinary_url && <><div  id={data.cloudinary_public_id}
                                            className='edit-controls food-pic'
                                            style={{display:'none',position:'relative'}}>
                                        <img  src={data.cloudinary_url} 
                                              width='100%' />
                                        <FaWindowClose  onClick={()=>hidePic(data.cloudinary_public_id)}
                                                        style={{position:'absolute',
                                                                color:'grey',
                                                                fontSize:'30px',
                                                                top:'5px',
                                                                left:'5px',
                                                                cursor:'pointer',
                                                                }}
                                                    
                                        />
                                      </div></>}
            {data.cloudinary_url && <div className='edit-controls'>
                                      <FaCamera style={{cursor:'pointer'}}
                                                onClick={()=>showPic(data.cloudinary_public_id)} /><br/>
                                    </div> }

            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            {data.name == 'cochinillo' ? <div style={{fontStyle:'italic'}}>(please allow 40 minutes cooking time)</div> : ''}
            <div className='edit-controls'>
              {data.sequence}<br/>
              <div className='button-flexbox'>
              <button className='edit-button'                     
                      style={{cursor:'pointer'}}
                      onClick={()=>updateForm(data._id,
                                              data.section,
                                              data.name,
                                              data.allergies,
                                              data.preDescription,
                                              data.description,
                                              data.price,
                                              data.cloudinary_url,
                                              data.cloudinary_public_id)}>
                <i  className='fa-solid fa-pen'></i>
                <span>Edit</span>                
                </button>
              
                <button onClick={()=>archive(data._id)} 
                        className='archive-button'>
                <BsFillArchiveFill />
                <span>Archive</span>
              </button>

              <button className='trash-button' 
                      onClick={()=>deleteDinnerItem(data._id)}
                      style={{cursor:'pointer'}}>
                <i  className='fa-solid fa-trash-can'
                    ></i>
                <span>Delete</span>
              </button>

            </div>{/* .button-flexbox */}
            {data.sequence != lastEntree && <><div className='move-down'>
              <PiArrowFatUpFill onClick={()=>moveDown(data._id)} 
                                style={{cursor:'pointer'}} />
            </div>{/* .move-down */}</>}
            </div>{/* edit-controls */}            
          </div>
        )
      })}

      <div  className='item chefs-tasting-menu'
            style={{paddingTop:marginVertical,
                    paddingBottom:marginVertical,
                    paddingLeft:paddingHorizontal,
                    paddingRight:paddingHorizontal}}>
        <span className='name'>chef's tasting menu </span> <span style={{fontStyle:'italic'}}>six courses <strong>105</strong> / person<br/>
        <strong>48-hours notice and reservation required</strong></span><br/>
        full table participation<br/>
        available tuesday through thursday<br/>
        <span style={{fontStyle:'italic'}}>optional wine pairing available <strong>52</strong> / person</span><br/>
      </div>
      </div>{/* entrees */}

  </div>{/* appetizersEntrees */}

  <h2 className='sides-heading' 
      style={{paddingLeft:paddingHorizontal,
              position:'relative',
              bottom:'15px'
      }}>
  sides
  </h2>
  <div className='sides'>
  {dinnerItems.filter(item=>(item.section == 'sides' && item.sequence > 0)).map(data=>{
        return(
          <div  key={data._id} 
                className='item'
                style={{marginTop:marginVertical,
                        marginBottom: !((data.section == 'sides' && data.sequence == 1) || 
                                      (data.section == 'sides' && data.sequence == 2)) ? 
                                      marginVertical : '',
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            {data.sequence != 1 && 
            <>
              <div className='edit-controls'>
                <div className='move-left'>
                  <span style={{position:'absolute',
                                transform:'rotate(90deg)'}}>
                      <PiArrowFatUpFill className='caret' 
                                        onClick={()=>moveUp(data._id)} />
                  </span>
                </div>{/* .move-left */}
                </div>{/* .edit-controls */}
            </>}
            
            {data.sequence != lastSide && 
            <>
              <div className='edit-controls'>
                <div className='move-right'>
                  <span style={{position:'absolute',
                                transform:'rotate(90deg)',
                                zIndex:'100'}}>
                      <PiArrowFatUpFill className='caret' 
                                        onClick={()=>moveDown(data._id)} />
                  </span>
                </div>{/* .move-right */}
              </div>{/* .edit-controls */}
            </>}
  
            {data.cloudinary_url && <><div  id={data.cloudinary_public_id}
                                            className='edit-controls food-pic'
                                            style={{display:'none',position:'relative'}}>
                                        <img  src={data.cloudinary_url} 
                                              width='100%' />
                                        <FaWindowClose  onClick={()=>hidePic(data.cloudinary_public_id)}
                                                        style={{position:'absolute',
                                                                color:'grey',
                                                                fontSize:'30px',
                                                                top:'5px',
                                                                left:'5px',
                                                                cursor:'pointer',
                                                                }}
                                                    
                                        />
                                      </div></>}
            {data.cloudinary_url && <div className='edit-controls'>
                                      <FaCamera style={{cursor:'pointer'}}
                                                onClick={()=>showPic(data.cloudinary_public_id)} /><br/>
                                    </div> }

            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <div className='button-flexbox'>
              <button className='edit-button'                     
                      style={{cursor:'pointer'}}
                      onClick={()=>updateForm(data._id,
                                              data.section,
                                              data.name,
                                              data.allergies,
                                              data.preDescription,
                                              data.description,
                                              data.price,
                                              data.cloudinary_url,
                                              data.cloudinary_public_id)}>
                <i  className='fa-solid fa-pen'></i>
                <span>Edit</span>                
                </button>
              
                <button onClick={()=>archive(data._id)} 
                        className='archive-button'>
                <BsFillArchiveFill />
                <span>Archive</span>
              </button>

              <button className='trash-button' 
                      onClick={()=>deleteDinnerItem(data._id)}
                      style={{cursor:'pointer'}}>
                <i  className='fa-solid fa-trash-can'
                    ></i>
                <span>Delete</span>
              </button>

            </div>{/* .button-flexbox */}
            </div>{/* edit-controls */}
          </div>
        )
      })}

  </div>{/* .sides */}









  <div className='dinner-menu-footer'>
      <div className='chef'>manuel romero, chef</div>
      <div><img src='/QR1.png' width='70px' /></div>
      <div className='legal-info'>
        consumer advisory: consumption of undercooked meat, poultry, eggs, or seafood may increase the risk of food-borne illnesses<br/>
        all menu items are subject to change according to seasonality and availability<br/>
        <strong>
          please alert your server if you have special dietary requirements before ordering: gl (gluten), d (dairy), n (nuts)
        </strong>

      </div>
  </div>{/* dinner-menu-footer */}
  </div>{/* dinner-menu */}
 









{/* form */}
 






 <div className='edit-controls'>
  <div id='dinner-menu-form-wrapper'>
  <form action={editForm?updateDinnerItem:addDinnerItem} id='dinner-menu-form'>
      {editForm ? <h2>Edit Item</h2> : <h2>Create New Item</h2>}
        <input type='hidden' id='id' name='id' value={hiddenID} />
        
        <label>
          Section:&nbsp;
          <select id='section' name='section' defaultValue=''>
            <option selected disabled value=''>Section...</option>
            <option value='meats'>Meats</option>
            <option value='appetizers'>Appetizers</option>
            <option value='entrees'>Entrées</option>
            <option value='sides'>Sides</option>
        </select>
        </label><br/>
        
        <label>
          Name:<br/>
          <input id='name' name='name' placeholder='Name' type='text' />
        </label><br/>
        
        <label>
          Allergies:<br/>
          <input id='allergies' name='allergies' placeholder='Allergies' type='text' />
        </label><br/>
        
        
        <label>
          Mini-Description:<br/>
          <input  id='pre-description' 
                  name='preDescription' 
                  placeholder='Mini-Description (optional)' 
                  type='text' />
        </label><br/>

        <label>
          Main Description:<br/>
          <textarea id='description' 
                    name='description' 
                    placeholder='Description'
                    // cols='30'
                    rows='6'></textarea>
          
        </label><br/>
        
        <label>
          Price:<br/>
          <input id='price' name='price' placeholder='Price' type='text' autoComplete='off' />
        </label><br/><br/><br/>


        {(editForm && editItemPhoto) && <>
                                          Current/Saved Image:<br/>
                                          <img  src={editItemPhoto} 
                                                id='editItemPhoto'
                                                height='300px' />
                                        </>} 
        {(editForm && !editItemPhoto) &&  <>
                                            <div style={{ display:'flex',
                                                          gap:'5px',
                                                          alignItems:'center'}}>
                                              <span>No Photo Saved: </span><FaImage />
                                            </div><br/><br/>
                                          </>}                                    

        <label>
          <div style={{display:'flex',gap:'5px'}}>
            <FaCamera />
            <span>
              {(editForm && editItemPhoto) && 'CHANGE '}
              {(editForm && !editItemPhoto) && 'ADD '}
              Photo: (optional)
            </span>
          </div>
          <input  type='file'
                  name='imageBinary'
                  id='image-binary'
                  onChange={handleFileInputChange} />
        </label><br/><br/>


        <input type='hidden' name='base64EncodedImage' value={previewSource} />

        <input type='hidden' name='cloudinary_url' value={cloudinary_url} />
        <input type='hidden' name='cloudinary_public_id' value={cloudinary_public_id} />

        {previewSource && <img src={previewSource}
                              alt='Image File Upload Preview'
                              style={{height:'300px'}} />}

        <div id='buttons-wrapper'>
          <button type='submit' 
                  style={editForm ? {background:'blue',color:'white'} : 
                                    {background:'green',color:'white'}}>
            {editForm?
              <div className='button-flexbox'><VscSave /> <span>Save Changes</span></div> : 
              <div className='button-flexbox'><FaPlusCircle /> <span>Add Item</span></div>}
          </button><br/><br/>

          <div  id='clear-button' 
                onClick={clearForm}
                className='btn'>
            <div className='button-flexbox'>
              <MdClear /> <span>Clear Form</span>
            </div>{/* .button-flexbox */}
          </div>
        </div>{/* #buttons-wrapper */}

      </form>
      </div>{/* dinner-menu-form-wrapper */}







{/* form */}






{/* archives */}



      {Boolean(Object.keys(dinnerItems.filter(item=>item.sequence == 0)).length) && 
        <>
          <div className='archives'>
            <h2>ARCHIVES</h2>
              {dinnerItems.filter(item=>item.sequence == 0).map(data=>{
                return(
                  <>
          <div  key={data._id} 
                className='item' 
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            
            
            <span className='name'>{data.name}</span>
            {data.name == 'jamón ibérico' ? '' : data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            
            
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            {data.description ? <span className='description'>{data.description}</span> : '' }
            
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              
              <div className='button-flexbox'>
              <button className='edit-button'                     
                      style={{cursor:'pointer'}}
                      onClick={()=>updateForm(data._id,
                                              data.section,
                                              data.name,
                                              data.allergies,
                                              data.preDescription,
                                              data.description,
                                              data.price,
                                              data.cloudinary_url,
                                              data.cloudinary_public_id)}>
                <i  className='fa-solid fa-pen'></i>
                <span>Edit</span>                
                </button>
              
              <button onClick={()=>unarchive(data._id)} 
                      className='archive-button'>
                <BsFillArchiveFill />
                <span>Unarchive</span>
              </button>

              <button className='trash-button' 
                      onClick={()=>deleteDinnerItem(data._id)}
                      style={{cursor:'pointer'}}>
                <i  className='fa-solid fa-trash-can'
                    ></i>
                <span>Delete</span>
              </button>

            </div>{/* .button-flexbox */}
            

            </div>{/* edit-controls */}
          </div>
                  </>
                )}
              )}
          </div>{/* .archives */}
        </>}
      
    </div>{/* edit-controls */}
    
    </div>{/* .wrapper-top */}
    <footer className='no-print'>&copy;2025 powered by Toggle Software</footer>
    </div>{/* .wrapper */}
    </>
  )
}