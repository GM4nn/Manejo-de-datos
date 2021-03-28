Vue.component('table_results',{
    delimiters: ['[[',']]'],
    props:{
      registers:{
        type: Array,
        default: ()=>[],
      }
    },
    data () {
        return {
            description_field:"",
            disable:true,
            pagination: {
              sortBy: 'desc',
              descending: false,
              page: 1,
              rowsPerPage: 3
            },
            columns: [
              {
                name: 'Clave',
                required: true,
                label: 'Clave',
                align: 'left',
                sortable: true
              },
              { name: 'Descripcion', align: 'right', label: 'Descripcion', field: 'descripcion', sortable: true }
            ]
        }
    },
    watch:{
      description_field:function (val){
        Bus.$emit('descripcion',val)
      }
    },
    computed: {
      pagesNumber () {
        return Math.ceil(this.registers.length / this.pagination.rowsPerPage)
      }
    },
    created(){
      Bus.$on('add_new_to_table', (val) => {
        console.log("registro ",val)
        this.registers.push(val)
      })
      Bus.$on('disable_description_input', (val) => {
        this.disable = val
        if(this.disable){
          this.description_field = ""
        }
      })
    },
    template:`
    <div>
        <q-table
          :data="registers"
          row-key="Clave"
          :pagination.sync="pagination"
          hide-pagination
          style='border-radius:30px;'
          class='q-pa-md'
        >
          <template v-slot:top>
            <h5 class="q-ma-none q-mr-lg">Descripcion</h5>
            <q-input standout="bg-grey" :readonly="disable" :disable="disable"  dense debounce="300" color="primary" v-model="description_field">
            </q-input>
          </template>

        </q-table>

      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="pagination.page"
          color="grey-8"
          :max="pagesNumber"
          size="md"
        />
      </div>
      
    </div>
    `
})