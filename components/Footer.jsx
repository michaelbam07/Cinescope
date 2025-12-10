

const Footer = () => {
    return (
        <div>
            <footer className="bg-primary text-gray-400 py-8 mt-12">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} City Pulse. All rights reserved.</p>
                    <p>Find your next experience</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer