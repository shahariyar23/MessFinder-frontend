const MessGallery = ({images}) =>{
      // fallback for small/broken images
  const fallback = "/fallback.jpg";
    return (
         <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-[3/2] rounded-lg overflow-hidden bg-slate-50 w-full">
      <img
        src={images[0] || fallback}
        alt="Main"
        className="row-span-2 col-span-1 w-full h-full object-cover bg-gray-100 min-h-[120px]"
        loading="lazy"
        onError={e => (e.currentTarget.src = fallback)}
      />
      <img
        src={images[1] || fallback}
        alt="Side 1"
        className="col-span-1 row-span-1 w-full h-full object-cover bg-gray-100 min-h-[60px]"
        loading="lazy"
        onError={e => (e.currentTarget.src = fallback)}
      />
      <img
        src={images[2] || fallback}
        alt="Side 2"
        className="col-span-1 row-span-1 w-full h-full object-cover bg-gray-100 min-h-[60px]"
        loading="lazy"
        onError={e => (e.currentTarget.src = fallback)}
      />
    </div>
    )
}

export default MessGallery;