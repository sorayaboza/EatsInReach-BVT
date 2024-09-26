export default function LearnMoreInfoCard({ info, effect }) {
    return (
        <>
            <div className="flex flex-row-reverse fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#AAD15F] p-12 rounded-xl">
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <div className="flex items-center justify-center bg-white h-8 w-8 font-white rounded-full">
                        <button className="font-bold" onClick={effect}> X </button>
                    </div>
                </div>
                { info }
            </div>
        </>
    );
}