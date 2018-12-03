package Classes;

public class CarType {
    //汽车名称
    private String car_name;
    //汽车品牌
    private String car_brand;
    //汽车类型
    private String car_type;
    //日租金
    private float daily_rent;
    //所需缴纳的押金
    private float car_deposit;

    public void setCar_name(String car_name) {
        this.car_name = car_name;
    }
    public void setCar_brand(String car_brand) {
        this.car_brand = car_brand;
    }
    public void setCar_type(String car_type) {
        this.car_type = car_type;
    }
    public void setDaily_rent(float daily_rent) {
        this.daily_rent = daily_rent;
    }
    public void setCar_deposit(float car_deposit) {
        this.car_deposit = car_deposit;
    }

    public String getCar_name() {
        return car_name;
    }
    public String getCar_brand() {
        return car_brand;
    }
    public String getCar_type() {
        return car_type;
    }
    public float getDaily_rent() {
        return daily_rent;
    }
    public float getCar_deposit() {
        return car_deposit;
    }
}
