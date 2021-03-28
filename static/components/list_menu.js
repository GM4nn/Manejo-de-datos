Vue.component('list_menu',{
    delimiters: ['[[',']]'],
    data() {
        return {
            toggle:true,
            description:"",
            show_message:false,
            message_detail:"",
            link:""
        };
    },
    created(){
        Bus.$on('descripcion', (val) => {
            this.description = val
        })  
    },
    methods:{
        close_message(){
            this.show_message = false
        },
        toggle_action(action){
            this.toggle = !this.toggle
            this.link = action
            if(action != "delete"){
                Bus.$emit('disable_description_input',false)
            }
            if(this.toggle){
                switch(action){
                    case "add":this.add()
                    case "delete":this.delete()
                    case "edit":this.edit()
                }
            }
        },

        async add(){
            this.link = ''
            let catalog = this.$parent.$parent.$parent.model
            Bus.$emit('disable_description_input',true)

            if(catalog === ''){
                this.show_message = true
                this.message_detail = "Tienes que seleccionar un Catalogo"
                return 
            }
            else{
                if(this.description === ''){
                    this.show_message = true
                    this.message_detail = "No es permitido dejar el campo de texto vacio"
                    return 
                }
            }
            
            const response = await fetch(`/add/${catalog}`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"description":this.description})
            })

            let data = await response.json()

            let get_data = data
            this.show_message = true
            this.message_detail = get_data.msg

            if (get_data.register != null){
                Bus.$emit('add_new_to_table',get_data.register)
            }
   
        },
        async delete(){
            this.link = ''
        },
        async edit(){
            this.link = ''
            let catalog = this.$parent.$parent.$parent.model
            Bus.$emit('disable_description_input',true)
        }
    },
    template:`
    <div class="q-py-lg bg-menu">
        <q-list class="rounded-borders q-gutter-y-md text-white  border-radius-all-custom">

        <q-item
            clickable
            v-ripple
            :active="link === 'add'"
            @click="toggle_action('add')"
            active-class="my-menu-link"
            class="q-px-auto"
            exact
        >
            <div class="col" />
            <q-item-section avatar>
                <q-icon name="add_box" color="positive" />
            </q-item-section>

            <q-item-section>
                <template v-if="link === 'add'">
                    Grabar
                </template>
                <template v-else>
                    Nuevo
                </template>
            </q-item-section>
            <div class="col" />
        </q-item>

        <q-item
            clickable
            v-ripple
            :active="link === 'delete'"
            @click="toggle_action('delete')"
            active-class="my-menu-link"
            class="q-px-auto"
            exact
        >
            <div class="col" />
            <q-item-section avatar>
                <q-icon name="delete" color="negative"/>
            </q-item-section>

            <q-item-section>
                <template v-if="link === 'delete'">
                    Grabar
                </template>
                <template v-else>
                    Eliminar
                </template>
            </q-item-section>
            <div class="col" />
        </q-item>

        <q-item
            clickable
            v-ripple
            :active="link === 'edit'"
            @click="toggle_action('edit')"
            active-class="my-menu-link"
            exact
        >
            <div class="col" />
            <q-item-section avatar>
                <q-icon name="create" color="yellow" />
            </q-item-section>

            <q-item-section>
                <template v-if="link === 'edit'">
                    Grabar
                </template>
                <template v-else>
                    Modificar
                </template>
            </q-item-section>
            <div class="col" />
        </q-item>

        <q-item
            clickable
            v-ripple
            active-class="my-menu-link"
            exact
        >
            <div class="col" />
            <q-item-section avatar>
                <q-icon name="close" color="warning" />
            </q-item-section>

            <q-item-section>Cancelar</q-item-section>
            <div class="col" />        
        </q-item>

        <q-item
            clickable
            v-ripple
            active-class="my-menu-link"
            exact
        >
            <div class="col" />
            <q-item-section avatar>
                <q-icon name="door_front" />
            </q-item-section>

            <q-item-section>Salir / Regresar</q-item-section>
            <div class="col" />
        </q-item>

        </q-list>

        <q-dialog v-model="show_message" seamless position="bottom">
            <q-card style="width: 450px">
            <q-card-section class="row items-center no-wrap">
                <div>
                <div class="text-weight-bold">Mensaje</div>
                <div class="text-grey">[[message_detail]]</div>
                </div>
                <q-space />
                <q-btn flat round icon="close" @click="close_message" v-close-popup />
            </q-card-section>
            </q-card>
        </q-dialog>    
        
      </div>
    
    `
})