/**
 * Assignment 7
 */
const albumInfoC = {
    props: ["album_id"],
    template: /* html */ `
    <div id="album_info">
        <div id="album_cover">
        <img v-bind:src="'/static/images/'+cover" alt="album cover"/>
        </div>
        <div id="album_songs">
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Length</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(track,index) in tracks">
                    <td class="song_no">{{index+1}}</td>
                    <td class="song_title">{{track.title}}</td>
                    <td class="song_length">{{track.length}}</td>
                </tr>
                <tr>
				    <td colspan="2"><strong>Total length:</strong></td>
				    <td class="song_length"><strong>{{length}}</strong></td>
			    </tr>
            </tbody>
			</table>	
        </div>
    </div>
    `,
    data:function(){
        return{
            tracks:[],
            cover:"",
            length:0
        }
    },
    watch:{
        album_id: async function(){
            let respons = await fetch("/albuminfo?album_id="+this.album_id)
        	if (respons.status==200){
        	    let result=await respons.json();
                this.tracks=result[0]
                this.cover=result[1]
                // calculate total length
                let totalSek=0
                for (let track of this.tracks){
                    let minSek=track.length.split(":")
                    totalSek+=parseFloat(minSek[0])*60+parseFloat(minSek[1])
        	    }
                let min=Math.floor(totalSek/60)
                let sek=Math.round(totalSek % 60)
                this.length=`${min<10?"0"+min:min}:${sek<10?"0"+sek:sek}`
            }
        }
    }
}
