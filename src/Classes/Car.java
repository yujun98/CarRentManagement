package Classes;

public class Car {
    //汽车编号
    private String car_number;
    //车牌号
    private String plate_number;
    //汽车名称
    private String car_name;
    //汽车状态
    private String car_state;
    //服务点编号
    private String shop_number;

    public void setCar_number(String car_number) {
        this.car_number = car_number;
    }
    public void setPlate_number(String plate_number) {
        this.plate_number = plate_number;
    }
    public void setCar_name(String car_name) {
        this.car_name = car_name;
    }
    public void setCar_state(String car_state) {
        this.car_state = car_state;
    }
    public void setShop_number(String shop_number) {
        this.shop_number = shop_number;
    }

    public String getCar_number() {
        return car_number;
    }
    public String getPlate_number() {
        return plate_number;
    }
    public String getCar_name() {
        return car_name;
    }
    public String getCar_state() {
        return car_state;
    }
    public String getShop_number() {
        return shop_number;
    }
}
