class Rendex {
    constructor() {
        this.components = {}
    }

    addComponent(c) {
        this.components[ c.name ] = {
            open: c.open(),
            close: c.close && c.close()
        }
    }
    
    render(spec) {
        const comp = this.components[ spec.component ]
        comp.open( comp.openParams || [] )
        if(spec.branch) {
            spec.branch.forEach(item => {
                this.render(item)
            })
        }
        return comp.close && comp.close( comp.closeParams || [] )

    }
}

