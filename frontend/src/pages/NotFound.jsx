
const NotFound = () => {
    return (
        <div>
<div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-secondary-200 via to-secondary-400  bg-fixed bg-cover bg-bottom error-bg"
    >

	<div class="container">
		<div class="row">
			<div class="col-sm-8 offset-sm-2 text-black text-center -mt-52">
				<div class="relative ">
				<h1 class="relative text-9xl tracking-tighter-less text-shadow font-sans font-bold">
					<span>4</span><span>0</span><span>4</span></h1>
					<span class="absolute  top-0   -ml-12  text-black font-semibold">Oops!</span>
					</div>
				<h5 class="text-black font-semibold -mr-10 -mt-3">Page not found</h5>
				<p class="text-black mt-2 mb-6">we are sorry, but the page you requested was not found</p>
				<a
					class="cursor-pointer bg-primary-400  px-5 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-50 rounded-full hover:shadow-lg">
					Got to Home
				</a>
			</div>
		</div>
	</div>
</div>
        </div>
    )
}


export default NotFound