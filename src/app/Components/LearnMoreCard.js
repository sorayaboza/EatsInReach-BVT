export default function LearnMoreCard({icon, title, description, effect}) {

    return (
        <div className="flex flex-col items-center w-52 mb-28">
            <div className="relative w-32 h-32 m-6 bg-[#AAD15F] rounded-full flex items-center justify-center overflow-hidden"> 
                <div className="absolute h-full w-full inset-0 flex items-center justify-center object-cover">
                    {icon}
                </div>
            </div>
            <div className="text-center">
                <h3 className="font-bold mb-2"> {title} </h3>
                <p> {description} </p>
                <p className="mt-10">
                    <button className="hover:underline" onClick={effect}> Learn More </button>
                </p>
            </div>
        </div>
    );
}