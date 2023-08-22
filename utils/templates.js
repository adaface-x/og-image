const templates = {
	"og-image": {
		backgroundColor: "#011F8A",
		fontColor: "#fff",
		html: ({
			name,
			tags,
			authorName,
			title,
			emoji,
			profilePicture,
			backgroundColor,
			fontColor,
		}) => `<div>
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Vollkorn&display=swap');
		  	
			.og-image { 
				font-family: Inter; 
				font-weight: 900; 
				width:1200px;
		  		height: 630px; 
				background-color: ${backgroundColor || "#01108a"}; 
				color: ${fontColor || "#fff"}; 
				margin: auto; 
			}
			.text-overflow {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			  }
			  .text-overflow-multiple-lines {
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			  }
			  .tags {
				background-color: white;
				height: fit-content;
				color: #363636;
				padding: 5px 8px 0px;
				border-radius: 3px;
				text-transform: uppercase;
				font-weight: 500;
				margin-top: 3px;
			  }
		</style>
	
		<div class='og-image' id='og-image'>
		  <div
			style='
				  padding: 30px 25px;
				  display: flex;
				  flex-direction: column;
				  justify-content: flex-start;
				  height: 100%;
				  '
		  >
			<div style='display:flex;min-height:4rem;height: 20%;margin-top: 35px;'>
			  <div
				class='text-overflow'
				style='
				width: 25%;
				text-align: center;
				font-size: 2rem;
				font-weight: 500;'
			  >${name || ""}</div>
			  <div
				style='
				  width: 75%;
				  padding-left: 15px;
				  display: flex;
				  justify-content: space-between;
				  font-weight: 700;
				  font-size: 1.5rem;
				  '
			  >
				<div style='display: flex; gap: 10px;'>
				  ${
						(tags || []).length > 0 && (tags || [])[0] !== ""
							? (tags || [])
									.filter((tag, i) => tag !== "" && i < 2)
									.map(
										(tag) => `<div
									class="text-overflow tags"
									
								>${(tag || "").trim()}</div>`
									)
									.join("")
							: ""
					}
				</div>
				<div style='font-size: 4.75rem;margin-right: 15px;'>${emoji || ""}</div>
			  </div>
			</div>
			<div style='display:flex;height: 60%;'>
			  <div
				style='width: 25%;text-align: center;font-size:1.25rem;margin: auto;height:75%'
			  >
			  ${
					profilePicture
						? `<img
							width='125'
							alt='profilePicture'
							src='${profilePicture || ""}'
							style='border-radius: 50%;width: 175px;height: 175px;object-fit: cover;'
							/>`
						: ""
				}
				<div
				  class='text-overflow'
				  style='text-align: center;margin-top: 40px;font-weight: 200;font-size: 1.75rem;'
				>${authorName || ""}</div>
			  </div>
			  <div  style='width: 75%;
              margin-left: 15px;
              height: 70%;
              max-height: 70%;'>
				<div
					style='font-size: 4.5rem;
						width: 95%;
						margin: auto 0;
						height: 100%;
						display: flex;
						justify-content: center;
						flex-direction: column;'
				>
				<div class='text-overflow-multiple-lines'>${title || ""}</div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </div>`,
	},
};

module.exports = templates;
