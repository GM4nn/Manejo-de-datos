new Vue({
    delimiters: ['[[',']]'],
    el: '#app',
    data () {
        return {
            leftDrawerOpen: false,
            options: [],
            model:"",
            descripcion:"",
            registers:[]
        }
    },
    watch:{
        model:function(val){
            fetch(`/catalogs/${val}`)
            .then(response => response.json())
            .then(data => {
                this.registers = data
            });
        }
    },
    created(){
        this.$q.dark.set(true)
    },
    mounted(){
        this.$nextTick(()=>{
            fetch('/catalogs')
            .then(response => response.json())
            .then(data => {
                data.find(catalog => {
                   this.options.push(catalog.NomFisCat)
                })
            });
        })
    },
    methods:{
        get_description(){
            
        }
    },
    template:`
        <q-layout
        view="hHh lpR fFf"
        class="full-width row justify-center items-center"
        >
        <q-page-container class="full-width row q-gutter-x-md justify-center items-center">
            <div class="col-8">
                <div class="row items-center q-pa-md q-col-gutter-md" 
                style="border-width: 1px;
                    border-style: solid;
                    border-color: white;
                    border-radius: 30px"
                >
                <div class="col-12">
                    <div class="row">
                    <div class="col-4">
                        Mantenimiento de Catalogo <br>
                        Nombre de Catalogo
                    </div>
                    <div class="col">
                        <q-select  standout="bg-teal text-white" v-model="model" :options="options" label="Buscar Catalogo" />
                    </div>
                    </div>
                </div>
                <div  class="col-8">
                    <table_results :registers="registers"/>
                </div>
                <div class="col">
                    <list_menu/>
                </div>
                </div>
            </div>      
        </q-page-container>
    </q-layout>
    `
})