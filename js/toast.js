//toast提示
var template = `
 <transition name="fade">
   <div class="toast-box">
        <div class="i-toast-mask" v-if="visible && mask" @click="visible=false"></div>
        <div class="i-toast" v-if="visible">
            <template v-if="type !== 'default'">
                <div class="i-toast-type">
                    <div class="i-icon i-toast-icon i-icon-success" type="success" v-if="type === 'success'"></div>
                    <div class="i-icon i-toast-icon i-icon-prompt" type="prompt" v-else-if="type === 'warning'"></div>
                    <div class="i-icon i-toast-icon i-icon-delete" type="delete" v-else-if="type === 'error'"></div>
                    <div class="i-icon i-toast-icon i-toast-loading" v-if="type === 'loading'"></div>
                </div>
            </template>
            <template v-else>
                <div class="i-icon i-toast-icon" v-bind:class="'i-icon-'+icon" v-if="icon"></div>
                <img class="i-toast-image" :src="image" v-if="image" alt="" />
            </template>
            <div class="i-toast-content" v-if="content">{{ content }}</div>
        </div>
    </div>
 </transition>`;
var Toast = {
    template: template,
    data() {
        return {
            visible: false,
            content: '',
            icon: '',
            image: '',
            duration: 3000,//自动关闭秒数，0不关闭
            mask: true,
            color: '',
            type: 'default', // default || success || warning || error || loading
        };
    },
    mounted() {
        this.autoClose();
    },
    methods: {
        //自动关闭
        autoClose: function () {
            var self = this;
            if (this.duration) {
                setTimeout(function () {
                    self.visible = false;
                }, this.duration);
            }
        },
        //手动关闭
        close() {
            this.visible = false;
        }
    }
}
var merge = function (target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
        var source = arguments[i] || {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }
    return target;
};
//单列模式
var instance = null;
function createInstance(options) {
    // 返回一个扩展实例构造器
    if (!instance) {
        var messageBox = Vue.extend(Toast);
        // 构造一个实例
        instance = new messageBox({ data: options }).$mount();
        // 把实例化的 toast.vue 添加到 body 里
        document.body.appendChild(instance.$el);
    } else {
        merge(instance._data, {
            visible: false,
            content: '',
            icon: '',
            image: '',
            duration: 3000,
            mask: true,
            color: '',
            type: 'default',
        }, options);
    }
    return instance;
};
Toast.install = function (options, type) {
    if (options === undefined || options === null) {
        options = {
            content: ''
        }
    } else if (typeof options === 'string' || typeof options === 'number') {
        options = {
            content: options
        }
        if (type != undefined && options != null) {
            options.type = type;
        }
    }
    instance = createInstance(options);
    this.$nextTick(function () {
        instance.visible = true;
    });
    if (instance.duration) {
        setTimeout(function () {
            instance.visible = false;
        }, instance.duration);
    }
    return instance;
}
Vue.prototype.$toast = Toast.install;