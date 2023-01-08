export default {
  data() {
    return {
      screen: {
        dialogWidth: '70%',
        labelPosition: 'left',
        mobile: false,
        pagination: 'prev, pager, next',
      },
    };
  },
  mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 700) {
        this.screen.mobile = true;
        this.screen.dialogWidth = '90%';
        this.screen.labelPosition = 'top';
        this.pagination = 'prev, pager, next';
      } else if (this.windowWidth < 900) {
        this.screen.mobile = true;
        this.screen.dialogWidth = '75%';
        this.screen.labelPosition = 'left';
        this.pagination = 'prev, pager, next';
      } else if (this.windowWidth < 1200) {
        this.screen.mobile = false;
        this.screen.dialogWidth = '75%';
        this.screen.labelPosition = 'left';
        this.pagination = 'total, sizes, prev, pager, next, jumper';
      } else {
        this.screen.mobile = false;
        this.screen.dialogWidth = '75%';
        this.screen.labelPosition = 'left';
        this.pagination = 'total, sizes, prev, pager, next, jumper';
      }
    },
  },
};
