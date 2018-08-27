const User = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  website: faker.internet.url(),
  address: faker.address.streetAddress() + faker.address.city() + faker.address.country(),
  bio: faker.lorem.sentences(),
  image: faker.image.avatar()
}
/*
ORGANISATION
name
email
phone
website
zip
streetAddress
city
country
note
image

PERSON
name
email
phone
zip
streetAddress
city
country
note
image
*/
