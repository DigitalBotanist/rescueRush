
const DriverDashboardHome = () => {
    return (
        <div className="flex w-full h-full">
        {/* left */}
        <div className="flex-1 flex flex-col h-full">
            {/* top row */}
            <div className="flex w-full h-fit gap-20 justify-between p-5">
                {/* vehicle info */}
                <div className="bg-white grow rounded-2xl p-5">
                    <span className="text-2xl block mb-5">
                        Vehicle Info
                    </span>
                    <div className="flex w-ful justify-between pr-5">
                        <span>VIN</span>
                        <span className="font-light">
                            LK-001
                        </span>
                    </div>
                    <div className="flex w-ful justify-between pr-5">
                        <span>Status</span>
                        <span className="font-light">
                            ACTIVE
                        </span>
                    </div>
                </div>
                {/* connection status */}
                <div className="w-fit bg-secondary-green rounded-2xl p-2 flex justify-center items-center h-10">
                    CONNECTED
                </div>
            </div>
            {/* driver info */}
            <div className="flex w-full h-fit gap-20 justify-between p-5">
                <div className="bg-white grow rounded-2xl p-5">
                    <span className="text-2xl block mb-5">
                        Driver
                    </span>
                    <div className="flex justify-between gap-10">
                        {/* driver image */}
                        <div className="bg-secondary-500 block rounded-[50%] h-full w-20 aspect-square"></div>
                        {/* driver name, contact */}
                        <div className="grow h-full">
                            <div className="flex w-ful h-full items-center justify-between pr-5">
                                <span>Name</span>
                                <span className="font-light">
                                    Kamal Amal
                                </span>
                            </div>
                            <div className="flex w-ful justify-between pr-5">
                                <span>Contact</span>
                                <span className="font-light">
                                    00987654334
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* paramedic info */}
            <div className="flex w-full h-fit gap-20 justify-between p-5">
                <div className="bg-white grow rounded-2xl p-5">
                    <span className="text-2xl block mb-5">
                        Paramedic Info
                    </span>
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between gap-10">
                            {/* driver image */}
                            <div className="bg-secondary-500 block rounded-[50%] h-full w-20 aspect-square"></div>
                            {/* driver name, contact */}
                            <div className="grow h-full">
                                <div className="flex w-ful h-full items-center justify-between pr-5">
                                    <span>Name</span>
                                    <span className="font-light">
                                        Kamal Amal
                                    </span>
                                </div>
                                <div className="flex w-ful justify-between pr-5">
                                    <span>Contact</span>
                                    <span className="font-light">
                                        00987654334
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-10">
                            {/* driver image */}
                            <div className="bg-secondary-500 block rounded-[50%] h-full w-20 aspect-square"></div>
                            {/* driver name, contact */}
                            <div className="grow h-full">
                                <div className="flex w-ful h-full items-center justify-between pr-5">
                                    <span>Name</span>
                                    <span className="font-light">
                                        Kamal Amal
                                    </span>
                                </div>
                                <div className="flex w-ful justify-between pr-5">
                                    <span>Contact</span>
                                    <span className="font-light">
                                        00987654334
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* right */}
        <div className="flex-2 bg-white h-full rounded-2xl">
            hehe
        </div>
    </div>
    )
}


export default DriverDashboardHome